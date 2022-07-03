// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fsPromises from "fs/promises";
import * as cheerio from "cheerio";
import https from "https";
import http from "http";
import { NavItem } from "@/types/index";

type Data = {
  name: string;
  url: string;
  description: string;
  icon: string;
  tags: string[];
  title: string;
};

const getWebsiteInfo = (url: string): Promise<Partial<Data>> => {
  const _http = url.indexOf("https") > 0 ? https : http;
  return new Promise((resolve, reject) => {
    _http.get(url, (res) => {
      let str = "";
      res.on("data", function (chunk) {
        str += chunk;
      });
      res
        .on("end", function () {
          const $ = cheerio.load(str);
          const title = $("title").text();
          const description = $("meta[name=description]").attr("content");
          const icon = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=16`;
          const data = {
            title,
            icon,
            description,
          };
          resolve(data);
        })
        .on("error", function () {
          console.log("error");
        });
    });
  });
};
const getUrrlDuplicate = (navs: Data[], url: string) => {
  let isDuplicate = false;
  navs.forEach((nav) => {
    if (nav.url.indexOf(url) > -1) {
      isDuplicate = true;
    }
  });
  return isDuplicate;
};
const getNav = async () => {
  const filePath = path.join(process.cwd(), "data.json");
  const jsonData = await fsPromises.readFile(filePath);
  const objectData = JSON.parse(jsonData.toString());
  return objectData;
};
const uploadNav = async (req: NextApiRequest) => {
  const params = req.body;
  const basicInfo = await getWebsiteInfo(params.url);
  const payload = {
    url: params.url || "",
    description: basicInfo.description,
    title: basicInfo?.title || "",
    tags: params.tags || [],
    icon: basicInfo.icon,
    remark: params.remark || "",
  };
  const filePath = path.join(process.cwd(), "data.json");
  const jsonData = await fsPromises.readFile(filePath);
  const objectData = JSON.parse(jsonData.toString());

  objectData.navs.push(payload);
  await fsPromises.writeFile(filePath, JSON.stringify(objectData));
};
const editNav = async (req: NextApiRequest) => {
  const params = req.body;
  const filePath = path.join(process.cwd(), "data.json");
  const jsonData = await fsPromises.readFile(filePath);
  const { navs } = JSON.parse(jsonData.toString());
  let targetIndex = -1;
  let target = navs.filter((item: NavItem, index: number) => {
    if (item.url === params.url) {
      targetIndex = index;
    }
    return item.url === params.url;
  })[0];
  target = { ...target, ...params };
  navs[targetIndex] = target;
  await fsPromises.writeFile(filePath, JSON.stringify({ navs }));
};
const deleteNav = async (req: NextApiRequest) => {
  const params = req.body;
  const filePath = path.join(process.cwd(), "data.json");
  const jsonData = await fsPromises.readFile(filePath);
  const { navs } = JSON.parse(jsonData.toString());
  let targetIndex = -1;
  navs.forEach((item: NavItem, index: number) => {
    if (item.url === params.url) {
      targetIndex = index;
    }
  });
  navs.splice(targetIndex, 1);
  await fsPromises.writeFile(filePath, JSON.stringify({ navs }));
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const params = req.body;
    const { navs } = await getNav();
    const isDuplicate = getUrrlDuplicate(navs, params.url);
    if (isDuplicate) {
      res
        .status(200)
        .send({ msg: "已经存在该网址", code: 10001, data: null } as any);
      return;
    }
    const r = await uploadNav(req);
    res.status(200).send({ msg: "ok", code: 0, data: null } as any);
  }
  if (req.method === "PUT") {
    try {
      const r = await editNav(req);
      res.status(200).send({ msg: "ok", code: 0, data: null } as any);
    } catch (error) {
      console.log(error);
      res.status(200).send({ msg: error, code: 10002, data: null } as any);
    }
  }
  if (req.method === "GET") {
    const data = await getNav();
    res.status(200).json(data);
  }
  if (req.method === "DELETE") {
    try {
      await deleteNav(req);
      res.status(200).send({ msg: "ok", code: 0, data: null } as any);
    } catch (error) {
      console.log(error);
      res.status(200).send({ msg: error, code: 10003, data: null } as any);
    }
  }
}

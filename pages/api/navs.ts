// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fsPromises from "fs/promises";
import * as cheerio from "cheerio";
import https from "https";
import http from "http";
import { NavItem } from "@/types/index";

const prisma = new PrismaClient();
type Data = {
  name: string;
  url: string;
  description: string;
  icon: string;
  tags: string[];
  title: string;
};

const getWebsiteInfo = (url: string): Promise<Partial<Data>> => {
  const _http = url.indexOf("https") > -1 ? https : http;
  console.log(url, "url");

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
const putNav = async (req: NextApiRequest) => {
  const params = req.body;
  const payload = {
    tags: params.tags || "",
    remark: params.remark || "",
  };
  await prisma.navs.update({
    where: {
      id: params.id,
    },
    data: payload,
  });
  return { code: 0, data: "", msg: "" };
};
const postNav = async (req: NextApiRequest) => {
  const params = req.body;
  const navs = await prisma.navs.findMany({
    where: {
      url: params.url,
    },
  });
  if (navs.length > 0) {
    return { code: 10001, data: "", msg: "该导航已经存在" };
  }
  const basicInfo = await getWebsiteInfo(params.url);
  const payload = {
    url: params.url || "",
    description: basicInfo.description,
    title: basicInfo?.title || "",
    tags: params.tags || "",
    icon: basicInfo.icon,
    remark: params.remark || "",
    category: params.category || "",
  };
  await prisma.navs.create({
    data: payload,
  });
  return { code: 0, data: "", msg: "" };
};
const getNav = async (req: NextApiRequest) => {
  const params = req.query;
  const searchKey = params?.searchKey || "";
  const navs = await prisma.navs.findMany({
    where: {
      OR: [
        {
          url: {
            contains: searchKey as string,
          },
        },
        {
          title: {
            contains: searchKey as string,
          },
        },
        {
          description: {
            contains: searchKey as string,
          },
        },
        {
          tags: {
            contains: searchKey as string,
          },
        },
      ],
    },
  });
  return { msg: "", code: 0, data: navs };
};
const deleteNav = async (req: NextApiRequest) => {
  const params = req.body;
  await prisma.navs.delete({
    where: {
      id: params.id,
    },
  });
  return { msg: "", code: 0, data: "" };
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const r = await postNav(req);
    res.status(200).send(r as any);
  }
  if (req.method === "PUT") {
    const r = await putNav(req);
    res.status(200).send(r as any);
  }
  if (req.method === "GET") {
    const r = await getNav(req);
    res.status(200).send(r as any);
  }
  if (req.method === "DELETE") {
    const r = await deleteNav(req);
    res.status(200).send(r as any);
  }
}

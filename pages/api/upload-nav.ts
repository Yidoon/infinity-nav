// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fsPromises from "fs/promises";
import * as cheerio from "cheerio";
import https from "https";

type Data = {
  name: string;
  url: string;
  description: string;
  icon: string;
  tags: string[];
  title: string;
};

const getWebsiteInfo = (url: string): Promise<Partial<Data>> => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
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
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
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
    res.status(200).send({ msg: "ok", code: 0 } as any);
    return;
  }
  if (req.method === "GET") {
    const filePath = path.join(process.cwd(), "data.json");
    const jsonData = await fsPromises.readFile(filePath);
    const objectData = JSON.parse(jsonData.toString());

    res.status(200).json(objectData);
  }
}

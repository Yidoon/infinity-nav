// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fsPromises from "fs/promises";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.body, "method");
  if (req.method === "POST") {
    const params = req.body;
    const payload = {
      name: params.name || "",
      url: params.url || "",
      description: params.description || "",
      tags: params.tags || [],
    };
    const filePath = path.join(process.cwd(), "data.json");
    const jsonData = await fsPromises.readFile(filePath);
    const objectData = JSON.parse(jsonData.toString());
    objectData.navs.push(payload);
    console.log();

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

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

type Data = {};
const prisma = new PrismaClient();

const getCategory = async () => {
  let level = 1;
  const data = await prisma.category.findMany({
    where: {
      level: level,
    },
  });
  async function _loop(data: any) {
    for (let i = 0, len = data.length; i < len; i++) {
      const item = data[i];
      const children = await prisma.category.findMany({
        where: {
          parent_id: item.id,
        },
      });
      if (children.length > 0) {
        item.children = children;
        await _loop(children);
      } else {
        item.children = [];
      }
    }
  }
  await _loop(data);
  return { msg: "", code: 0, data: data };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const r = await getCategory();
    res.status(200).send(r as any);
  }
}

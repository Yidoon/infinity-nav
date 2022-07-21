import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const addRules = async (req: NextApiRequest) => {
  const params = JSON.parse(req.body);
  // const params = req.body;
  const payload = {
    days: params.days,
    start_time: params.start_time,
    end_time: params.end_time,
    navs: params.navs,
  };
  try {
    await prisma.rule.create({
      data: payload,
    });
    return { code: 0, data: "", msg: "" };
  } catch (error) {
    return { code: 10000, data: "", msg: "Server error" };
  }
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const r = await addRules(req);
    res.status(200).send(r as any);
  }
}

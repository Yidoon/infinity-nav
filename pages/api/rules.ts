import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { RuleItem } from "@/types/index";

const prisma = new PrismaClient();

const updateRule = (rule: RuleItem) => {
  return prisma.rule.update({
    where: {
      id: rule.id!,
    },
    data: rule,
  });
};
const createRule = (rule: RuleItem) => {
  return prisma.rule.create({
    data: rule,
  });
};
const getRule = () => {
  return prisma.rule.findMany();
};
const isRemoveRule = async (req: NextApiRequest) => {
  const params = JSON.parse(req.body);
  const { rules } = params;
  const data = await getRule();
  if (rules.length < data.length) {
    for (let i = 0, len = data.length; i < len; i++) {
      if (!rules.find((rule: RuleItem) => rule.id === data[i].id)) {
        await prisma.rule.delete({
          where: {
            id: data[i].id,
          },
        });
      }
    }
  }
};
const handleRules = async (req: NextApiRequest) => {
  const params = JSON.parse(req.body);
  const { rules } = params;
  await isRemoveRule(req);
  for (let i = 0, len = rules.length; i < len; i++) {
    let data: any = {
      name: rules[i].name,
      days: rules[i].days,
      start_time: rules[i].start_time,
      end_time: rules[i].end_time,
      navs: rules[i].navs,
    };
    if (rules[i].id) {
      try {
        if (!rules[i].name) {
          rules[i].name = `规则${i + 1}`;
        }
        data.id = rules[i].id;
        await updateRule(data);
      } catch (error) {
        console.log(error, "error");
        return { code: 10002, data: "", msg: "Server error" };
      }
    } else {
      try {
        if (!rules[i].name) {
          rules[i].name = `规则${i + 1}`;
        }
        await createRule(data);
      } catch (error) {
        return { code: 10003, data: "", msg: "Server error" };
      }
    }
  }
  return { code: 0, data: "", msg: "" };
};
const getRules = async (req: NextApiRequest) => {
  try {
    const data = await prisma.rule.findMany();
    return { code: 0, data: data, msg: "" };
  } catch (error) {
    return { code: 10001, data: "", msg: "Server error" };
  }
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const r = await handleRules(req);
    res.status(200).send(r as any);
  }
  if (req.method === "GET") {
    const r = await getRules(req);
    res.status(200).send(r as any);
  }
}

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

const handleRules = async (req: NextApiRequest) => {
  const params = JSON.parse(req.body);
  console.log(params, "ppppp");
  const { rules } = params;
  for (let i = 0, len = rules.length; i < len; i++) {
    if (rules[i].id) {
      try {
        if (!rules[i].name) {
          rules[i].name = `规则${i + 1}`;
        }
        await updateRule(rules[i]);
      } catch (error) {
        return { code: 10002, data: "", msg: "Server error" };
      }
    } else {
      try {
        if (!rules[i].name) {
          rules[i].name = `规则${i + 1}`;
        }
        await createRule(rules[i]);
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

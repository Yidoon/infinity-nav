import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

type Data = {}
const prisma = new PrismaClient()

const getCategory = async () => {
  let level = 1
  const data = await prisma.category.findMany({
    where: {
      parent_id: null,
    },
  })
  async function _loop(data: any) {
    for (let i = 0, len = data.length; i < len; i++) {
      const item = data[i]
      const children = await prisma.category.findMany({
        where: {
          parent_id: item.id,
        },
      })
      if (children.length > 0) {
        item.children = children
        await _loop(children)
      } else {
        item.children = []
      }
    }
  }
  await _loop(data)
  return { msg: '', code: 0, data: data }
}

const postCategory = async (req: NextApiRequest) => {
  const params = req.body
  const payload = {
    name: params.name,
    parent_id: params.parent_id,
    level: params.level,
  }
  await prisma.category.create({
    data: payload,
  })
  return { code: 0, data: '', msg: '' }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    const r = await getCategory()
    res.status(200).send(r as any)
  }
  if (req.method === 'POST') {
    const r = await postCategory(req)
    res.status(200).send(r as any)
  }
}

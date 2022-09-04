import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Data = {
  id: number
  name: string
}
const getTags = async (req: NextApiRequest) => {
  const params = req.query
  const searchKey = params?.search_key || ''
  const data = await prisma.tag.findMany({
    where: {
      name: {
        contains: searchKey as string,
      },
    },
  })
  return { msg: '', code: 0, data: data }
}
const postTags = async (req: NextApiRequest) => {
  const params = req.body
  console.log(params, 'params.name')
  const payload = {
    name: params.name,
  }
  console.log(payload, 'payload')
  await prisma.tag.create({
    data: payload,
  })
  return { code: 0, data: '', msg: '' }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    const r = await getTags(req)
    res.status(200).send(r as any)
  }
  if (req.method === 'POST') {
    const r = await postTags(req)
    res.status(200).send(r as any)
  }
}

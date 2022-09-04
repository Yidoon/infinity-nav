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
const putTags = async (req: NextApiRequest) => {
  const params = req.body
  await prisma.tag.update({
    where: {
      id: params.id,
    },
    data: params,
  })
}
const deleteTag = async (req: NextApiRequest) => {
  const { id } = req.query
  if (!id) return { msg: '', code: 100045, data: '缺少参数' }
  await prisma.tag.delete({
    where: {
      id: +id,
    },
  })
  return { msg: '', code: 0, data: '' }
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
  if (req.method === 'PUT') {
    const r = await putTags(req)
    res.status(200).send(r as any)
  }
}

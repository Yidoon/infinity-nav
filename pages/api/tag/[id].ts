import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Data = {
  id: number
  name: string
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
  if (req.method === 'DELETE') {
    const r = await deleteTag(req)
    res.status(200).send(r as any)
  }
  if (req.method === 'PUT') {
    const r = await putTags(req)
    res.status(200).send(r as any)
  }
}

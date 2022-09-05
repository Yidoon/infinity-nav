import { TagItem } from '@/types/index'
import { Tag } from 'antd'
import { useEffect, useState } from 'react'

const TagList = () => {
  const [tagList, setTagList] = useState<TagItem[]>([])

  const getTags = async (params?: { search_key: string }) => {
    const res = await fetch(
      `/api/tag?search_key=${params?.search_key || ''}`
    ).then((res) => res.json())
    setTagList(res.data)
  }
  console.log(tagList, 'tagList')
  useEffect(() => {
    getTags()
  }, [])

  return (
    <div className="flex">
      {tagList.map((item) => {
        return <Tag key={item.id}>{item.name}</Tag>
      })}
    </div>
  )
}

export default TagList

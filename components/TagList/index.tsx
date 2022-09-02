import { TagItem } from '@/types/index'
import { Table, Button, Input, Popconfirm, Form } from 'antd'
import React, { useEffect, useState } from 'react'

const TagList = () => {
  const [tagList, setTagList] = useState<TagItem[]>([])
  const [tagForm] = Form.useForm()
  const getTags = async () => {
    const res = await fetch(`/api/tag`).then((res) => res.json())
    setTagList(res.data)
  }
  const createTag = async () => {
    const params = tagForm.getFieldsValue()
    await fetch(`/api/tag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    getTags()
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '标签名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '上次更新时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
    },
  ]

  const renderCreateTagForm = () => {
    return (
      <Form form={tagForm}>
        <Form.Item name="name" label="标签名">
          <Input placeholder="请输入标签名" />
        </Form.Item>
      </Form>
    )
  }
  const InputEl = <Input />
  useEffect(() => {
    getTags()
  }, [])

  return (
    <div>
      <div style={{ backgroundColor: '#fff' }}>
        <Popconfirm
          icon={null}
          title={renderCreateTagForm()}
          onConfirm={createTag}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link">新增标签</Button>
        </Popconfirm>
      </div>
      <div>
        <Table columns={columns} dataSource={tagList} />
      </div>
    </div>
  )
}

export default TagList

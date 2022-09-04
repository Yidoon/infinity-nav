import AdminLayout from '@/components/Layout/AdminLayout'
import { NextPageWithLayout } from 'pages/_app'
import { TagItem } from '@/types/index'
import { Table, Button, Input, Popconfirm, Form, Space, message } from 'antd'
import React, { useEffect, useState, ReactElement } from 'react'
import classes from './index.module.scss'

const TagManagePage: NextPageWithLayout = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(true)
  const [tagList, setTagList] = useState<TagItem[]>([])
  const [tagForm] = Form.useForm()

  const getTags = async (params?: { search_key: string }) => {
    const res = await fetch(
      `/api/tag?search_key=${params?.search_key || ''}`
    ).then((res) => res.json())
    setTagList(res.data)
    setTableLoading(false)
  }
  const deleteTag = async (id: number) => {
    await fetch(`/api/tag/${id}`, {
      method: 'DELETE',
    })
    message.success('操作成功')
    handleSearch()
  }
  const handleSearch = (val?: string) => {
    getTags({ search_key: val || '' })
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
    tagForm.resetFields()
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
      render: (v: number) => {
        return (
          <Button
            style={{ paddingLeft: 0 }}
            type="link"
            onClick={() => {
              deleteTag(v)
            }}
          >
            删除
          </Button>
        )
      },
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
  useEffect(() => {
    getTags()
  }, [])

  return (
    <div className={classes.tagManage}>
      <Space size={8} className={classes.tagHeader}>
        <Input.Search
          style={{ width: 240 }}
          onSearch={handleSearch}
          placeholder="搜索标签"
        />
        <Popconfirm
          icon={null}
          title={renderCreateTagForm()}
          onConfirm={createTag}
          okText="确定"
          cancelText="取消"
        >
          <Button type="primary">新增标签</Button>
        </Popconfirm>
      </Space>
      <div>
        <Table
          loading={tableLoading}
          size="middle"
          columns={columns}
          rowKey="id"
          dataSource={tagList}
        />
      </div>
    </div>
  )
}

export default TagManagePage

TagManagePage.getLayout = (page: ReactElement) => {
  return <AdminLayout>{page}</AdminLayout>
}

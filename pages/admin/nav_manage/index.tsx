import AdminLayout from '@/components/Layout/AdminLayout'
import NavForm from '@/components/NavForm'
import { NavItem } from '@/types/index'
import {
  Avatar,
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
} from 'antd'
import { NextPageWithLayout } from 'pages/_app'
import React, { ReactElement, useEffect, useState } from 'react'
import classes from './index.module.scss'

const NavManagePage: NextPageWithLayout = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(true)
  const [navList, setNavList] = useState<NavItem[]>([])

  const [configVisible, setConfigVisible] = useState<boolean>(false)
  const [configForm] = Form.useForm()

  const reqNavs = async (searchKey?: string) => {
    const res = await fetch(`/api/navs?searchKey=${searchKey || ''}`).then(
      (res) => res.json()
    )
    setNavList(res.data)
    setTableLoading(false)
  }
  const deleteNav = async (id: number) => {
    const res = await fetch(`/api/nav/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json())
    if (res.code !== 0) {
      message.error(res.msg)
      return
    }
    message.success('操作成功')
    reqNavs()
  }
  const openConfigDrawer = () => {}
  const renderNavTable = () => {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'icon',
        dataIndex: 'icon',
        key: 'icon',
        render: (v: string) => {
          return <Avatar size="large" src={v} />
        },
      },
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'URL',
        dataIndex: 'url',
        key: 'url',
      },
      {
        title: '标签',
        dataIndex: 'tags',
        key: 'tags',
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '更新时间',
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
            <Space>
              <Popconfirm
                title="确定删除吗?"
                onConfirm={() => {
                  deleteNav(v)
                }}
                okText="确定"
                cancelText="取消"
              >
                <Button style={{ paddingLeft: 0 }} type="link">
                  删除
                </Button>
              </Popconfirm>

              <Button
                style={{ paddingLeft: 0 }}
                type="link"
                onClick={openConfigDrawer}
              >
                编辑
              </Button>
            </Space>
          )
        },
      },
    ]
    return (
      <Table
        loading={tableLoading}
        size="middle"
        columns={columns}
        rowKey="id"
        dataSource={navList}
      />
    )
  }
  const renderNavConfigDrawer = () => {
    const handleOk = async () => {
      const values = configForm.getFieldsValue()
      const res = await fetch('/api/navs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }).then((res) => res.json())
      if (res.code !== 0) {
        message.error(res.msg)
        return
      }
      message.success('操作成功')
      setConfigVisible(false)
      reqNavs()
    }
    return (
      <Modal
        title="新增网站"
        width={680}
        cancelText="取消"
        okText="确定"
        onCancel={() => {
          setConfigVisible(false)
        }}
        onOk={handleOk}
        visible={configVisible}
      >
        <NavForm
          form={configForm}
          hideBottomBtn
          onFinish={handleOk}
          onReset={() => {
            configForm.resetFields()
          }}
        />
      </Modal>
    )
  }
  useEffect(() => {
    reqNavs()
  }, [])
  return (
    <div className={classes.navManage}>
      <Space size={8} className="mb-4">
        <Input.Search
          style={{ width: 240 }}
          onSearch={reqNavs}
          placeholder="搜索导航"
        />
        <Button
          type="primary"
          onClick={() => {
            setConfigVisible(true)
          }}
        >
          新增网站
        </Button>
      </Space>
      <div>{renderNavTable()}</div>
      {renderNavConfigDrawer()}
    </div>
  )
}

export default NavManagePage

NavManagePage.getLayout = (page: ReactElement) => {
  return <AdminLayout>{page}</AdminLayout>
}

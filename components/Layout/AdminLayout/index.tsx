import SiteLogo from '@/components/SiteLogo'
import { Layout, Menu } from 'antd'
import Link from 'next/link'
import { useState } from 'react'

const { Sider, Content } = Layout

const AdminLayout = (props: any) => {
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<string[]>([
    'nav_manage',
  ])
  const handleMenuSelect = ({ key }: any) => {
    setSelectedMenuKeys([key])
  }
  const items = [
    {
      key: 'nav_manage',
      label: <Link href="/admin/nav_manage">导航管理</Link>,
    },
    {
      key: 'tag_manage',
      label: <Link href="/admin/tag_manage">标签管理</Link>,
    },
    {
      key: 'site_manage',
      label: <Link href="/admin/site_manage">站点管理</Link>,
    },
  ]
  return (
    <Layout>
      <Sider theme="light">
        <div
          style={{
            borderRight: '1px solid rgba(0,0,0,0.08)',
            height: '100vh',
          }}
        >
          <SiteLogo />
          <Menu
            mode="inline"
            onSelect={handleMenuSelect}
            selectedKeys={selectedMenuKeys}
            items={items}
          />
        </div>
      </Sider>
      <Content>{props.children}</Content>
    </Layout>
  )
}

export default AdminLayout

import SiteLogo from '@/components/SiteLogo'
import TagList from '@/components/TagList'
import { TagItem } from '@/types/index'
import { Layout, Menu } from 'antd'
import { useState } from 'react'
import classes from './index.module.scss'

const { Sider, Content } = Layout

const AdminPage = () => {
  const [tagList, setTagList] = useState([])
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<string[]>([
    'tag_manage',
  ])
  const renderContent = () => {
    const _key = selectedMenuKeys[0]
    switch (_key) {
      case 'tag_manage':
        return <TagList />
      case 'nav_manage':
        return '导航管理'
      case 'site_manage':
        return '网站管理'
    }
  }

  const handleMenuSelect = ({ key }: any) => {
    console.log(key, 'kkkk')
    setSelectedMenuKeys([key])
  }
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
          >
            <Menu.Item key="nav_manage">导航管理</Menu.Item>
            <Menu.Item key="tag_manage">标签管理</Menu.Item>
            <Menu.Item key="site_manage">网站管理</Menu.Item>
          </Menu>
        </div>
      </Sider>
      <Content className={classes.content}>{renderContent()}</Content>
    </Layout>
  )
}

export default AdminPage

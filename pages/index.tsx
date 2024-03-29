import type { NextPage } from 'next'
import { Layout } from 'antd'
import SiteLogo from '@/components/SiteLogo'
import CategorySetting from '@/components/CategorySetting'
import Category from '@/components/Category'
import HeaderContent from '@/components/Header'
import TagList from '@/components/TagList'

const { Header, Sider, Content } = Layout
const Home: NextPage = () => {
  return (
    <Layout>
      <Sider width={240} theme="light">
        <div
          style={{
            borderRight: '1px solid rgba(0,0,0,0.08)',
            height: '100vh',
            paddingLeft: 16,
          }}
        >
          <SiteLogo />
          <TagList />
          {/* <Category /> */}
          {/* <CategorySetting /> */}
        </div>
      </Sider>
      <Layout>
        <Header
          style={{
            backgroundColor: '#fff',
            textAlign: 'right',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <HeaderContent />
        </Header>
        <Content>首页</Content>
      </Layout>
    </Layout>
  )
}

export default Home

import { Modal, Tree, Layout } from 'antd'
import styles from './style/setting-modal.module.scss'
import CategoryTree from './CategoryTree'
import CategoryConfig from './CategoryConfig'

const { Sider, Content } = Layout
interface Props {
  visible: boolean
  onOk: () => void
  onCancel: () => void
}
const SettingModal = (props: Props) => {
  const { visible, onOk, onCancel } = props
  return (
    <Modal
      title="设置分类"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={null}
      width={820}
    >
      <Layout className="flex">
        <Sider
          width={280}
          theme="light"
          style={{
            borderRight: '1px solid rgba(0,0,0,0.15)',
            marginRight: 24,
            paddingRight: 16,
          }}
        >
          <CategoryTree />
        </Sider>
        <Content>
          <CategoryConfig />
        </Content>
      </Layout>
    </Modal>
  )
}

export default SettingModal

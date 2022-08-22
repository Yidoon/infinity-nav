import styles from './style/index.module.scss'
import { SettingOutlined } from '@ant-design/icons'
import SettingModal from './SettingModal'
import { useState } from 'react'
import { Button } from 'antd'
import CategorySettingProvider from './store'

const CategroySetting = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  return (
    <CategorySettingProvider>
      <Button
        className={styles.menuSetting}
        onClick={() => {
          setModalVisible(true)
        }}
      >
        <SettingOutlined className={styles.menuSettingIcon} />
        设置分类
      </Button>
      <SettingModal
        visible={modalVisible}
        onOk={() => {
          setModalVisible(false)
        }}
        onCancel={() => {
          setModalVisible(false)
        }}
      />
    </CategorySettingProvider>
  )
}

export default CategroySetting

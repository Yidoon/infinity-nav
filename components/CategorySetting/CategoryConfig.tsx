import { Button, Form, Input, Space } from 'antd'
import { useEffect } from 'react'
import { useCategorySettingContext } from './store'

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}
const CategoryConfig = () => {
  const { treeSelected, isCreateCate } = useCategorySettingContext()
  const [configForm] = Form.useForm()
  const selectedItem = treeSelected?.[0]
  // 显示导航的创建时间
  // 显示导航的更新时间
  useEffect(() => {
    if (treeSelected[0]) {
      configForm.setFieldsValue({
        name: selectedItem.name,
        icon: selectedItem.iconUrl,
      })
    }
  }, [treeSelected])

  useEffect(() => {
    if (isCreateCate) {
      configForm.resetFields()
      if (selectedItem) {
        configForm.setFieldsValue({
          parent_id: selectedItem.id,
        })
      }
    }
  }, [isCreateCate])

  const submitForm = () => {
    const values = configForm.getFieldsValue()
    const payload = { ...values }
    if (selectedItem?.id && !isCreateCate) {
      payload.id = selectedItem.id
    }
    console.log(payload)
  }
  const handleReset = () => {
    configForm.resetFields()
  }
  const renderConfigForm = () => {
    return (
      <Form form={configForm} onFinish={submitForm}>
        <Form.Item noStyle hidden name="parent_id">
          <Input />
        </Form.Item>
        <Form.Item label="名称" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="icon" name="icon">
          <Input />
        </Form.Item>
        <Form.Item>
          <img
            src={selectedItem?.iconUrl}
            style={{ width: 100, height: 100 }}
            alt=""
          />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space size={8}>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
            <Button htmlType="button" onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    )
  }
  return (
    <div>
      {selectedItem || isCreateCate ? renderConfigForm() : '暂未选中分类'}
    </div>
  )
}

export default CategoryConfig

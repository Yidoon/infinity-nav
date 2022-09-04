import React from 'react'
import { Button, Form, FormInstance, Input, Space } from 'antd'
import MenuSelect from '../MeunSelect'

const FORM_LAYOUT = {
  labelCol: {
    span: 5,
  },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}
interface IProps {
  form: FormInstance
  onFinish?: () => void
  onReset?: () => void
  hideBottomBtn?: boolean
  isEdit?: boolean
}
const NavForm = (props: IProps) => {
  const { form, onFinish, onReset, hideBottomBtn = false, isEdit } = props
  return (
    <Form form={form} {...FORM_LAYOUT} onFinish={onFinish}>
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>
      <Form.Item label="Url" name="url">
        <Input placeholder="Website link" disabled={isEdit} />
      </Form.Item>
      {/* <Form.Item label="分类" name="category">
        <MenuSelect />
      </Form.Item> */}
      <Form.Item label="Tag" name="tags">
        <Input placeholder="Tags" />
      </Form.Item>
      <Form.Item label="remark" name="remark">
        <Input.TextArea />
      </Form.Item>
      {!hideBottomBtn && (
        <Form.Item {...tailLayout} style={{ textAlign: 'right' }}>
          <Space size={8}>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
            <Button htmlType="button" onClick={onReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      )}
    </Form>
  )
}

export default NavForm

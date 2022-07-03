import React from "react";
import { Button, Form, FormInstance, Input, Space } from "antd";

const FORM_LAYOUT = {
  labelCol: {
    span: 5,
  },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
interface IProps {
  form: FormInstance;
  onFinish?: () => void;
  onReset?: () => void;
  hideBottomBtn?: boolean;
}
const NavForm = (props: IProps) => {
  const { form, onFinish, onReset, hideBottomBtn = false } = props;
  return (
    <Form form={form} {...FORM_LAYOUT} onFinish={onFinish}>
      <Form.Item label="Url" name="url">
        <Input placeholder="Website link" />
      </Form.Item>
      <Form.Item label="Tag" name="tags">
        <Input placeholder="Tags" />
      </Form.Item>
      <Form.Item label="remark" name="remark">
        <Input.TextArea />
      </Form.Item>
      {!hideBottomBtn && (
        <Form.Item {...tailLayout} style={{ textAlign: "right" }}>
          <Space size={8}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      )}
    </Form>
  );
};

export default NavForm;

import React from "react";
import { Form, TimePicker, Checkbox, FormInstance, Input } from "antd";

const FORM_LAYOUT = {
  labelCol: {
    span: 5,
  },
};
interface IProps {
  form: FormInstance;
}
const RueForm = (props: IProps) => {
  const { form } = props;
  const weekOptions = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  return (
    <Form {...FORM_LAYOUT} form={form}>
      <Form.Item name="days" label="周期">
        <Checkbox.Group options={weekOptions} />
      </Form.Item>
      <Form.Item name="times" label="时间">
        <TimePicker />
      </Form.Item>
      <Form.Item label="展示的导航" name="navs">
        <Input />
      </Form.Item>
    </Form>
  );
};

export default RueForm;

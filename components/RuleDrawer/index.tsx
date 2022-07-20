import { Button, Drawer, FormInstance, Modal, Space } from "antd";
import React from "react";
import RuleForm from "../RuleForm";

interface IProps {
  visible: boolean;
  form: FormInstance;
  onOk: () => void;
  onCancel: () => void;
}
const RuleDrawer = (props: IProps) => {
  const { visible, form, onOk, onCancel } = props;
  const Footer = (
    <div className="text-right">
      <Space size={8}>
        <Button onClick={onCancel}>取消</Button>
        <Button type="primary" onClick={onOk}>
          确定
        </Button>
      </Space>
    </div>
  );
  return (
    <Modal
      width={820}
      visible={visible}
      title="规则"
      okText="确定"
      cancelText="取消"
      // footer={Footer}
      onCancel={onCancel}
      onOk={onOk}
    >
      <RuleForm form={form} />
    </Modal>
  );
};

export default RuleDrawer;

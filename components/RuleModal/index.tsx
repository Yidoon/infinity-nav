import { Button, Drawer, FormInstance, Modal, Space } from "antd";
import React from "react";
import RuleForm from "../RuleForm";

interface IProps {
  visible: boolean;
  form: FormInstance;
  onOk: () => void;
  onCancel: () => void;
}
const RuleModal = (props: IProps) => {
  const { visible, form, onOk, onCancel } = props;
  return (
    <Modal
      width={820}
      visible={visible}
      title="规则"
      okText="确定"
      cancelText="取消"
      onCancel={onCancel}
      onOk={onOk}
    >
      <RuleForm form={form} />
    </Modal>
  );
};

export default RuleModal;

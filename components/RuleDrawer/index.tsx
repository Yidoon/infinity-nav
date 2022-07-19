import { Drawer, FormInstance } from "antd";
import React from "react";
import RuleForm from "../RuleForm";

interface IProps {
  visible: boolean;
  form: FormInstance;
}
const RuleDrawer = (props: IProps) => {
  const { visible, form } = props;
  return (
    <Drawer size="large" visible={visible} title="规则">
      <RuleForm form={form} />
    </Drawer>
  );
};

export default RuleDrawer;

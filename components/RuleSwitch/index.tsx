import { RuleItem } from "@/types/index";
import { Button, Form, message, Switch } from "antd";
import React, { useEffect, useState } from "react";
import RuleModal from "../RuleModal";

const RuleSwitch = () => {
  const [ruleList, setRuleList] = useState<RuleItem[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [ruleForm] = Form.useForm();
  const reqRules = async () => {
    const res = await fetch("/api/rules").then((res) => res.json());
    console.log(res, "rrrr");
    setRuleList(res.data);
  };
  const handleRuleOk = async () => {
    const values = ruleForm.getFieldsValue();
    console.log(values, "vvv");
    const params = {
      days: values.days,
      start_time: values?.times?.[0] || 0,
      end_time: values?.times?.[1] || 0,
      navs: values.navs,
    };
    const res = await fetch("/api/rules", {
      method: "POST",
      body: JSON.stringify(values),
    }).then((res) => res.json());
    if (res.code === 0) {
      ruleForm.resetFields();
      setVisible(false);
      message.success("Success");
    } else {
      message.error(res.msg);
    }
  };
  const renderRuleModal = () => {
    return (
      <RuleModal
        visible={visible}
        form={ruleForm}
        onOk={handleRuleOk}
        value={ruleList}
        onCancel={() => {
          setVisible(false);
        }}
      />
    );
  };

  useEffect(() => {
    if (visible) {
      reqRules();
    }
  }, [visible]);

  return (
    <div>
      {ruleList.length === 1 ? (
        <Switch />
      ) : (
        <Button
          type="link"
          onClick={() => {
            setVisible(true);
          }}
        >
          切换规则
        </Button>
      )}
      {renderRuleModal()}
    </div>
  );
};

export default RuleSwitch;

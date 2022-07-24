import { RuleItem } from "@/types/index";
import {
  Button,
  Card,
  Checkbox,
  Drawer,
  Form,
  FormInstance,
  Input,
  Modal,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import NavPick from "../NavPick";
import RuleForm from "../RuleForm";
import RuleTime from "../RuleTime";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "./index.module.css";

const weekOptions = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
interface IProps {
  visible: boolean;
  form: FormInstance;
  value: RuleItem[];
  onOk: () => void;
  onCancel: () => void;
}
const RuleModal = (props: IProps) => {
  const { visible, form, onOk, onCancel, value } = props;
  const [ruleList, setRuleList] = useState<RuleItem[]>([]);
  const [titleEditIndex, setTitleEditIndex] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    setRuleList(value);
    form.setFieldsValue({
      rules: value,
    });
  }, [value]);

  const renderRuleList = () => {
    return (
      <Form form={form} name="dynamic_rules">
        <Form.List name="rules">
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map(({ key, name, ...restField }) => {
                  const v = form.getFieldsValue();
                  const v1 = v.rules[key].name;
                  console.log(form.getFieldsValue(), "titleStr");
                  console.log(v1, "v111");
                  const titleStr = v1 || `规则${key}`;
                  const TextEl = (
                    <div className="flex items-center gap-2">
                      <span>{titleStr}</span>
                      <EditOutlined
                        className={styles.ruleTitleEdit}
                        onClick={() => {
                          setTitleEditIndex(key);
                        }}
                      />
                    </div>
                  );
                  const InputEl = (
                    <div className="flex items-center gap-x-2">
                      <Form.Item
                        name={[name, "name"]}
                        style={{ marginBottom: 0 }}
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.name !== curValues.name
                        }
                      >
                        <Input
                          style={{ width: "200px" }}
                          placeholder="请输入规则名称"
                          autoFocus
                          onPressEnter={() => {
                            setTitleEditIndex(undefined);
                          }}
                        />
                      </Form.Item>
                      <Button
                        type="primary"
                        onClick={() => {
                          setTitleEditIndex(undefined);
                        }}
                        size="small"
                      >
                        确定
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          form.resetFields([`rules[${key}].name`]);
                          setTitleEditIndex(undefined);
                        }}
                      >
                        取消
                      </Button>
                    </div>
                  );
                  const TitleEl = titleEditIndex === key ? InputEl : TextEl;
                  return (
                    <Card title={TitleEl} key={key} style={{ marginTop: 24 }}>
                      <Form.Item name={[name, "days"]} label="周期">
                        <Checkbox.Group options={weekOptions} />
                      </Form.Item>
                      <Form.Item name={[name, "times"]} label="时间">
                        <RuleTime />
                      </Form.Item>
                      <Form.Item name={[name, "navs"]} label="展示的导航">
                        <NavPick />
                      </Form.Item>
                      <Form.Item name={[name, "id"]} hidden noStyle>
                        <Input />
                      </Form.Item>
                    </Card>
                  );
                })}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add sights
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
      </Form>
    );
  };
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
      {renderRuleList()}
    </Modal>
  );
};

export default RuleModal;

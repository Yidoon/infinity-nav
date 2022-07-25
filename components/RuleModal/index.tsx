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
  TimePicker,
} from "antd";
import React, { useEffect, useState } from "react";
import NavPick from "../NavPick";
import RuleForm from "../RuleForm";
import RuleTime from "../RuleTime";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "./index.module.css";
import produce from "immer";
import moment from "moment";
import dayjs from "dayjs";

const weekOptions = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const TEMP_RULE = {
  name: "",
  days: [],
  start_time: 0,
  end_time: 0,
  navs: [],
};
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
    const _rules = value.map((item) => {
      return {
        ...item,
        times: [
          moment(moment.unix(item.start_time).format("HH:mm:ss"), "HH:mm:ss"),
          moment(moment.unix(item.end_time).format("HH:mm:ss"), "HH:mm:ss"),
        ],
      };
    });
    form.setFieldsValue({
      rules: _rules,
    });
  }, [value]);

  const renderRuleList = () => {
    return (
      <Form form={form} name="dynamic_rules">
        <Form.List name="rules">
          {(fields, { add, remove }) => {
            return (
              <>
                <div
                  style={{
                    overflow: "auto",
                    maxHeight: "800px",
                    padding: "8px",
                  }}
                >
                  {fields.map(({ key, name, ...restField }) => {
                    const v = form.getFieldsValue();
                    const v1 = v.rules[key].name;
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
                        <Form.Item label="时间" name={[name, "times"]}>
                          <TimePicker.RangePicker
                            placeholder={["开始时间", "结束时间"]}
                          />
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
                </div>
                <Form.Item style={{ marginTop: 16 }}>
                  <Button
                    type="dashed"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => {
                      form.setFieldsValue({
                        rules: produce(ruleList, (draft) => {
                          draft.push(TEMP_RULE);
                        }),
                      });
                    }}
                    block
                    icon={<PlusOutlined />}
                  >
                    添加规则
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

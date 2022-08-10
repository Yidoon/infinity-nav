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
  Switch,
  TimePicker,
} from "antd";
import React, { useEffect, useState } from "react";
import NavPick from "../NavPick";
import { EditOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "./index.module.css";
import produce from "immer";
import moment from "moment";
import dayjs from "dayjs";

const weekOptions = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const TEMP_RULE = {
  name: "",
  days: [],
  times: [],
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
  const [titleEditIndex, setTitleEditIndex] = useState<number | undefined>(
    undefined
  );
  const renderRuleTips = (index: number) => {
    const rules = form.getFieldsValue().rules;
    const target = rules[index];
    const daysText = (
      <span style={{ color: "#3b82f6" }}>{target.days.join("、")}</span>
    );
    const timeText = (
      <span style={{ color: "#3b82f6" }} className="mx-2">
        {target.times[0].format("HH:mm:ss")} -
        {target.times[1].format("HH:mm:ss")}
      </span>
    );
    const navsText = (
      <span className="mx-2" style={{ color: "#3b82f6" }}>
        {target.navs.length}
      </span>
    );
    return (
      <>
        在 {daysText}, {timeText}的时候，会展示以下 {navsText}个导航
      </>
    );
  };
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
            console.log(fields, "fields");
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
                    const OperationEl = (
                      <div className="flex items-center gap-x-2">
                        <Switch />
                        <DeleteOutlined
                          className={styles.cardDelete}
                          onClick={() => {
                            remove(name);
                          }}
                        />
                      </div>
                    );
                    const CardTitle = (
                      <div className="flex items-center justify-between">
                        <div>{TitleEl}</div>
                        <div>{OperationEl}</div>
                      </div>
                    );
                    return (
                      <Card
                        title={CardTitle}
                        key={key}
                        style={{ marginTop: 24 }}
                      >
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
                        <div>{renderRuleTips(key)}</div>
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
                      add(TEMP_RULE);
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

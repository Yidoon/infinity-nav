import { Space, TimePicker } from "antd";
import { Moment } from "moment";
import React from "react";

type Value = [number | null, number | null];
interface IProps {
  onChange?: (val: Value) => void;
  value?: Value;
}
const RuleTime = (props: IProps) => {
  const { value, onChange } = props;
  const handleChange = (type: "start" | "end", val: Moment | null) => {
    const _val = val ? val.unix() : null;
    const _newValue: Value =
      type === "start"
        ? [_val, value?.[1] ? value[1] : null]
        : [value?.[0] ? value[0] : null, _val];
    onChange?.(_newValue);
  };
  return (
    <Space size={8}>
      <TimePicker
        placeholder="开始时间段"
        onChange={(val: Moment | null) => {
          handleChange("start", val);
        }}
      />
      <TimePicker placeholder="结束时间段" />
    </Space>
  );
};

export default RuleTime;

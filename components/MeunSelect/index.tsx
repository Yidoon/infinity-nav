import React, { useEffect, useState } from "react";
import { Cascader } from "antd";
import { MenuItem } from "@/types/index";

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}
interface Props {
  value?: any;
  onChange?: (value: any) => void;
}
const MenuSelect = (props: Props) => {
  const { value, onChange } = props;
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const getCategory = async () => {
    const res = await fetch(`/api/category`).then((res) => res.json());
    setMenus(res.data);
  };
  useEffect(() => {
    getCategory();
  }, []);
  return (
    <div>
      <Cascader
        style={{ width: "100%" }}
        options={menus}
        onChange={onChange}
        multiple
        value={value}
        maxTagCount="responsive"
        fieldNames={{ label: "name", value: "id", children: "children" }}
      />
    </div>
  );
};

export default MenuSelect;

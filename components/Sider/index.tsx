import React, { useEffect } from "react";
import styles from "./index.module.scss";
import { Menu } from "antd";

const Sider = () => {
  const items = [
    { label: "菜单项一", key: "item-1" }, // 菜单项务必填写 key
    { label: "菜单项二", key: "item-2" },
    {
      label: "子菜单",
      key: "submenu",
      children: [{ label: "子菜单项", key: "submenu-item-1" }],
    },
  ];
  const getCategory = async () => {
    const res = await fetch(`/api/category`).then((res) => res.json());
    console.log(res, "getCategory");
  };
  useEffect(() => {
    getCategory();
  }, []);

  return (
    <div className={styles.siderWrap}>
      <Menu items={items} mode="inline" />
    </div>
  );
};
export default Sider;

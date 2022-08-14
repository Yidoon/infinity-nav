import React, { memo, useContext, useEffect, useMemo, useState } from "react";
import styles from "./index.module.scss";
import { Menu } from "antd";
import { MenuItem } from "@/types/index";
import { HomeOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import GlobalContext from "@/store/global";

const { Item, SubMenu } = Menu;

const Sider = () => {
  const router = useRouter();
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const globalState = useContext(GlobalContext);
  const { menuId } = globalState;
  const getCategory = async () => {
    const res = await fetch(`/api/category`).then((res) => res.json());
    setMenus(res.data);
  };
  const handleMenuClick = (id: number) => {
    globalState.menuId = id;
    router.push(`/category/${id}`);
  };
  const initMenu = () => {
    const { id } = router.query;
    globalState.menuId = id as string;
  };
  initMenu();

  const renderMenuItem = (item: MenuItem) => {
    return (
      <div
        className="flex justify-between items-center"
        onClick={() => {
          handleMenuClick(item.id);
        }}
      >
        <div>{item.name}</div>
        <div>...</div>
      </div>
    );
  };
  const loopMenus = (menus: MenuItem[]) => {
    return menus.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <SubMenu key={item.id} title={item.name}>
            {loopMenus(item.children)}
          </SubMenu>
        );
      }
      return <Item key={item.id}>{renderMenuItem(item)}</Item>;
    });
  };
  const isHomePath = useMemo(() => {
    return router.pathname === "/";
  }, [router]);
  useEffect(() => {
    getCategory();
  }, []);
  console.log([String(menuId)], "[String(menuId)]");
  return (
    <div className={styles.siderWrap}>
      <div
        className={`${styles.siderHome} h-10 flex items-center cursor-pointer pl-6 gap-x-2`}
        style={{
          backgroundColor: isHomePath ? "#e6f7ff" : "#fff",
          color: isHomePath ? "#1890ff" : "#000",
        }}
        onClick={() => {
          globalState.menuId = undefined;
          router.push(`/`);
        }}
      >
        <HomeOutlined />
        <span className="align-center">首页</span>
      </div>
      <Menu selectedKeys={[String(menuId)]} mode="inline">
        {loopMenus(menus)}
      </Menu>
    </div>
  );
};
export default observer(Sider);

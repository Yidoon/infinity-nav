import { Button, Drawer, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import { SelectOutlined } from "@ant-design/icons";
import { NavItem } from "@/types/index";

interface IProps {
  onChange?: (val: any) => {};
  value?: any;
}
const NavPick = (props: IProps) => {
  const { onChange, value } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [navList, setNavList] = useState<NavItem[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onCancel = () => {
    setVisible(false);
  };
  const onOk = () => {};
  const reqNavs = async () => {
    const res = await fetch(`/api/navs`).then((res) => res.json());
    setNavList(res.data);
  };
  const renderNavPickDrawer = () => {
    const columns = [
      {
        title: "名称",
        dataIndex: "title",
        key: "title",
        render: (v: string) => {
          return (
            <div
              style={{ maxWidth: "200px" }}
              title="v"
              className="text-ellipsis overflow-hidden whitespace-nowrap"
            >
              {v}
            </div>
          );
        },
      },
      {
        title: "Url",
        dataIndex: "url",
        key: "url",
      },
      {
        title: "Tags",
        dataIndex: "tags",
        key: "tags",
      },
      {
        title: "备注",
        dataIndex: "remark",
        key: "remark",
      },
    ];
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    };
    const Footer = (
      <div className="text-right flex justify-between items-center">
        <div>
          {selectedRowKeys.length > 0 && (
            <>
              已选择
              <span className="ml-1 mr-1" style={{ color: "#1890ff" }}>
                {selectedRowKeys.length}
              </span>
              个导航
            </>
          )}
        </div>
        <Space size={8}>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={onOk}>
            确定
          </Button>
        </Space>
      </div>
    );
    return (
      <Drawer
        width={820}
        visible={visible}
        title="选择导航"
        footer={Footer}
        onClose={onCancel}
      >
        <Table
          dataSource={navList}
          rowKey="id"
          columns={columns}
          size="small"
          rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
        />
      </Drawer>
    );
  };

  useEffect(() => {
    if (visible) {
      reqNavs();
    }
  }, [visible]);
  return (
    <>
      <Button
        icon={<SelectOutlined />}
        size="middle"
        style={{ display: "flex", alignItems: "center" }}
        onClick={() => {
          setVisible(true);
        }}
      >
        选择导航
      </Button>
      {renderNavPickDrawer()}
    </>
  );
};

export default NavPick;

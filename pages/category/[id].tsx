import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NavItem } from "@/types/index";
import NavCard from "@/components/NavCard";
import { Form, message, Modal, Spin } from "antd";
import NavForm from "@/components/NavForm";
import GlobalContext from "@/store/global";
import styles from "./index.module.scss";
import classnames from "classnames";

const Navs = () => {
  const [data, setData] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const globalState = useContext(GlobalContext);
  const { menuId } = globalState;

  const routerObj = useRouter();
  const [uploadForm] = Form.useForm();
  const { id } = routerObj.query;

  const reqNavs = async (searchKey?: string) => {
    const res = await fetch(
      `/api/navs?searchKey=${searchKey || ""}&category=${menuId || ""}`
    ).then((res) => res.json());
    setData(res.data);
    setLoading(false);
  };
  const handleEdit = (item: NavItem) => {
    uploadForm.setFieldsValue({
      ...item,
    });
    setShowEditModal(true);
  };
  const handleDelete = async (item: NavItem) => {
    const res = await fetch("/api/navs", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: item.id }),
    }).then((res) => res.json());
    if (res.code !== 0) {
      message.error(res.msg);
      return;
    }
    setLoading(true);
    reqNavs();
  };
  const handleEditSubimt = async () => {
    const values = uploadForm.getFieldsValue();
    const res = await fetch("/api/navs", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }).then((res) => res.json());
    if (res.code !== 0) {
      message.error(res.msg);
      return;
    }
    setLoading(true);
    setShowEditModal(false);
    reqNavs();
  };
  const handleSubmit = async () => {
    const values = uploadForm.getFieldsValue();
    const res = await fetch("/api/navs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }).then((res) => res.json());
    if (res.code !== 0) {
      message.error(res.msg);
      return;
    }
    setLoading(true);
    reqNavs();
  };
  const handleRest = () => {};
  const renderEditModal = () => {
    return (
      <Modal
        visible={showEditModal}
        title="Edit"
        cancelText="Cancel"
        okText="Submit"
        onCancel={() => {
          setShowEditModal(false);
          uploadForm.resetFields();
        }}
        onOk={handleEditSubimt}
      >
        <NavForm
          form={uploadForm}
          onFinish={handleSubmit}
          onReset={handleRest}
          hideBottomBtn
          isEdit={showEditModal}
        />
      </Modal>
    );
  };
  const els = data.map((nav: NavItem, index: number) => {
    return (
      <NavCard
        data={nav}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        key={index}
      />
    );
  });
  const renderNavs = () => {
    return (
      <div className={classnames("flex flex-wrap", styles.navWrap)}>{els}</div>
    );
  };
  useEffect(() => {
    reqNavs();
  }, [menuId]);
  return (
    <Spin spinning={loading}>
      <div className={styles.contentWrap}>
        {renderNavs()}
        {renderEditModal()}
      </div>
    </Spin>
  );
};

export default Navs;

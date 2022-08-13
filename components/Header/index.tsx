import { Button, Form, message, Popover } from "antd";
import React, { useState } from "react";
import styles from "./index.module.scss";
import NavForm from "@/components/NavForm";
import { CloudUploadOutlined } from "@ant-design/icons";

const Header = () => {
  const [uploadForm] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const handleRest = () => {};
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
  };
  return (
    <div className={styles.headerWrap}>
      <Popover
        content={
          <NavForm
            form={uploadForm}
            onFinish={handleSubmit}
            onReset={handleRest}
          />
        }
        title="Upload Link"
        trigger="click"
        overlayInnerStyle={{ width: 460 }}
      >
        <Button
          type="link"
          shape="round"
          style={{ padding: 0, display: "flex", alignItems: "center" }}
        >
          上传网址
          <CloudUploadOutlined />
        </Button>
      </Popover>
    </div>
  );
};

export default Header;

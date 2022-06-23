import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import NavCard from "@/components/NavCard";
import fsPromises from "fs/promises";
import path from "path";
import { NavItem } from "@/types/index";
import { Button, Form, Input, Popover, Space } from "antd";
import { useMemo, useState } from "react";

const FORM_LAYOUT = {
  labelCol: {
    span: 5,
  },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
interface Props {
  navs: NavItem[];
}
const Home: NextPage<Props> = (props) => {
  const { navs } = props;
  const [searchKey, setSearchKey] = useState<string>("");
  const [uploadForm] = Form.useForm();

  const _navs = useMemo(() => {
    console.log(searchKey, "searchKey");

    return navs.filter((item) => {
      return (
        item.name.indexOf(searchKey) > -1 ||
        item.description.indexOf(searchKey) > -1 ||
        item.tags.join("").indexOf(searchKey) > -1
      );
    });
  }, [searchKey, navs]);

  const els = _navs.map((nav, index) => {
    return <NavCard {...nav} key={index} />;
  });
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearchKey(e.target.value);
    }
    e.preventDefault();
  };
  const handleRest = () => {};
  const handleSubmit = () => {
    const values = uploadForm.getFieldsValue();
    fetch("/api/upload-nav", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
  };
  const renderUploadForm = () => {
    return (
      <Form form={uploadForm} {...FORM_LAYOUT} onFinish={handleSubmit}>
        <Form.Item label="Url" name="url">
          <Input placeholder="Website link" />
        </Form.Item>
        <Form.Item label="Name" name="name">
          <Input placeholder="Display name" />
        </Form.Item>
        <Form.Item label="Tag" name="tag">
          <Input placeholder="Display name" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item {...tailLayout} style={{ textAlign: "right" }}>
          <Space size={8}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={handleRest}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    );
  };
  const renderHeader = () => {
    return (
      <div className="flex justify-between">
        <div style={{ width: "40%" }}>
          <Input placeholder="Just Search you want" onKeyUp={handleSearch} />
        </div>
        <div className="flex gap-x-4">
          <Popover
            content={renderUploadForm()}
            title="Upload Link"
            trigger="click"
            overlayInnerStyle={{ width: 460 }}
          >
            <Button type="primary" shape="round">
              Upload Link
            </Button>
          </Popover>
        </div>
      </div>
    );
  };

  const renderNavs = () => {
    return <div className="flex mt-16 gap-x-4 flex-wrap gap-y-4">{els}</div>;
  };
  return (
    <div className={styles.container}>
      {renderHeader()}
      {renderNavs()}
    </div>
  );
};

export default Home;

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "data.json");
  const jsonData = await fsPromises.readFile(filePath);
  const objectData = JSON.parse(jsonData.toString());
  return {
    props: objectData,
  };
}

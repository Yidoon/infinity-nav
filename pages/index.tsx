import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import NavCard from "@/components/NavCard";
import NavForm from "@/components/NavForm";
import fsPromises from "fs/promises";
import path from "path";
import { NavItem } from "@/types/index";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popover,
  Space,
  Spin,
} from "antd";
import { useEffect, useMemo, useState } from "react";

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
  const [searchKey, setSearchKey] = useState<string>("");
  const [data, setData] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const reqNavs = async () => {
    const res = await fetch("/api/upload-nav").then((res) => res.json());
    setData(res.navs);
    setLoading(false);
  };
  const [uploadForm] = Form.useForm();

  const _navs = useMemo(() => {
    return data.filter((item: NavItem) => {
      return (
        item.title.indexOf(searchKey) > -1 ||
        item.description.indexOf(searchKey) > -1 ||
        item.tags.indexOf(searchKey) > -1
      );
    });
  }, [searchKey, data]);

  const handleEdit = (item: NavItem) => {
    console.log(item, "item");
    uploadForm.setFieldsValue({
      ...item,
    });
    setShowEditModal(true);
  };
  const handleDelete = async (item: NavItem) => {
    const res = await fetch("/api/upload-nav", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: item.url }),
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
    const res = await fetch("/api/upload-nav", {
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
  const els = _navs.map((nav: NavItem, index: number) => {
    return (
      <NavCard
        data={nav}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        key={index}
      />
    );
  });

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchKey((e.target as HTMLInputElement).value);
    }
    e.preventDefault();
  };
  const handleRest = () => {};
  const handleSubmit = async () => {
    const values = uploadForm.getFieldsValue();
    const res = await fetch("/api/upload-nav", {
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
  const renderHeader = () => {
    return (
      <div className="flex justify-between">
        <div style={{ width: "40%" }}>
          <Input placeholder="Just Search you want" onKeyUp={handleSearch} />
        </div>
        <div className="flex gap-x-4">
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
        />
      </Modal>
    );
  };
  useEffect(() => {
    setLoading(true);
    reqNavs();
  }, []);

  return (
    <>
      <Spin spinning={loading}>
        <div className={styles.container}>
          {renderHeader()}
          {renderNavs()}
        </div>
      </Spin>
      {renderEditModal()}
    </>
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

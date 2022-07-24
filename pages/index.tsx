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
  Spin,
  Switch,
  Layout,
  Tooltip,
} from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import RuleModal from "@/components/RuleModal";
import RuleSwitch from "@/components/RuleSwitch";

const { Header, Footer, Sider, Content } = Layout;

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
  const [data, setData] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showRule, setShowRule] = useState<boolean>(false);
  const [ruleForm] = Form.useForm();

  const reqNavs = async (searchKey?: string) => {
    const res = await fetch(`/api/navs?searchKey=${searchKey || ""}`).then(
      (res) => res.json()
    );
    setData(res.data);
    setLoading(false);
  };
  const [uploadForm] = Form.useForm();

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

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // setSearchKey();
      reqNavs((e.target as HTMLInputElement).value);
    }
    e.preventDefault();
  };
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
    reqNavs();
  };
  const renderSearch = () => {
    return (
      <div className="flex justify-center mt-8">
        <div style={{ width: "60%" }}>
          <Input
            size="large"
            style={{ borderRadius: "50px" }}
            placeholder="搜索，支持网址、标签的模糊搜索"
            onKeyUp={handleSearch}
          />
        </div>
      </div>
    );
  };
  const renderHeader = () => {
    return (
      <div className="header flex items-center gap-x-4">
        <RuleSwitch />

        <div className="flex gap-x-4 items-center ">
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
          isEdit={showEditModal}
        />
      </Modal>
    );
  };
  useEffect(() => {
    setLoading(true);
    reqNavs();
  }, []);

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{
          backgroundColor: "#fff",
          textAlign: "right",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {renderHeader()}
      </Header>
      <Content style={{ backgroundColor: "#efefef", height: "100%" }}>
        <Spin spinning={loading}>
          <div className={styles.container}>
            {renderSearch()}
            {renderNavs()}
          </div>
        </Spin>
      </Content>
      {renderEditModal()}
    </Layout>
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

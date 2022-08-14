import "../styles/globals.css";
import type { AppProps } from "next/app";
import "antd/dist/antd.css";
import { Layout } from "antd";
import SiderMenu from "@/components/Sider";
import HeaderContent from "@/components/Header";
import GlobalContext, { state as globalState } from "@/store/global";

const { Header, Sider, Content } = Layout;
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalContext.Provider value={globalState}>
      <Layout>
        <Sider
          width={240}
          theme="light"
          style={{ borderRight: "1px solid rgba(0,0,0,0.08)" }}
        >
          <SiderMenu />
        </Sider>
        <Layout>
          <Header
            style={{
              backgroundColor: "#fff",
              textAlign: "right",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <HeaderContent />
          </Header>
          <Content>
            <Component {...pageProps} />
          </Content>
        </Layout>
      </Layout>
    </GlobalContext.Provider>
  );
}

export default MyApp;

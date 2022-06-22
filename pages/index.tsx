import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import NavCard from "@/components/NavCard";
import fsPromises from "fs/promises";
import path from "path";
import { NavItem } from "@/types/index";
import { Button, Input } from "@chakra-ui/react";
import { useMemo, useState } from "react";
interface Props {
  navs: NavItem[];
}
const Home: NextPage<Props> = (props) => {
  const { navs } = props;
  const [searchKey, setSearchKey] = useState<string>("");
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
  const renderHeader = () => {
    return (
      <div className="flex justify-between">
        <div style={{ width: "40%" }}>
          <Input placeholder="Just Search you want" onKeyUp={handleSearch} />
        </div>
        <div className="flex gap-x-4">
          <Button colorScheme="blue">UploadLink</Button>
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

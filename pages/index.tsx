import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import NavCard from "../components/NavCard";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <header>
        <NavCard />
      </header>

      <main className={styles.main}></main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export default Home;

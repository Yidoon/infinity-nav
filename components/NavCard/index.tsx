import React, { useMemo } from "react";
import styles from "./index.module.css";
import classnames from "classnames";
import { NavItem } from "@/types/index";

export default function NavCard(props: NavItem) {
  const { name, description, tags, url } = props;

  const _tags = useMemo(() => {
    return tags.map((t) => `#${t}`).join(" ");
  }, [tags]);

  const _classNames = classnames(
    "cursor-pointer flex flex-col justify-between p-2 rounded-md inline-block",
    styles.navCard
  );
  const handleClick = () => {
    window.open(url, "_blank");
  };

  return (
    <div className={_classNames} onClick={handleClick}>
      <div className="text-xl">{name || url}</div>
      <div className="text-sm text-slate-500 mt-2 ml-1" title={description}>
        {description}
      </div>
      <div className="text-xs text-slate-400 mt-1">{_tags}</div>
    </div>
  );
}

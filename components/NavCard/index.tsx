import React, { useMemo } from "react";
import styles from "./index.module.css";
import classnames from "classnames";
import { NavItem } from "@/types/index";

export default function NavCard(props: NavItem) {
  const { description, tags, url, title, icon } = props;

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
      <div className="flex gap-x-2 items-center">
        <img src={icon} className="h-5 w-5" alt="" />
        <div className={classnames("text-xl", styles.titleText)}>{title}</div>
      </div>
      <div
        className={classnames(
          "text-sm text-slate-500 mt-2 ml-1",
          styles.max3RowText
        )}
        title={description}
      >
        {description}
      </div>
      <div className="text-xs text-slate-400 mt-1">{_tags}</div>
    </div>
  );
}

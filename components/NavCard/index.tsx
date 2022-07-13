import React, { useMemo } from "react";
import styles from "./index.module.css";
import classnames from "classnames";
import { NavItem } from "@/types/index";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface IProps {
  data: NavItem;
  handleEdit: (data: NavItem) => void;
  handleDelete: (data: NavItem) => void;
}
export default function NavCard(props: IProps) {
  const { data } = props;
  const { description, tags, url, title, icon } = data;

  const _tags = useMemo(() => {
    const arr = tags ? tags.split(";") : [];

    if (arr.length > 0) {
      return arr.map((t) => `#${t}`).join(" ");
    }
    return "";
  }, [tags]);

  const _classNames = classnames(
    "cursor-pointer flex flex-col justify-between p-2 rounded-md inline-block",
    styles.navCard
  );
  const handleClick = () => {
    window.open(url, "_blank");
  };
  const _handleEdit = (e) => {
    props.handleEdit(data);
    e.preventDefault();
    e.stopPropagation();
  };
  const _handleDelete = (e) => {
    props.handleDelete(data);
    e.preventDefault();
    e.stopPropagation();
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
      <div className={`${styles.editArea} rounded-md flex flex-col gap-y-2`}>
        <EditOutlined className={styles.handleIcon} onClick={_handleEdit} />
        <DeleteOutlined className={styles.handleIcon} onClick={_handleDelete} />
      </div>
    </div>
  );
}

import { Button, Tree } from 'antd'
import type { DataNode } from 'antd/es/tree'
import useCategory from '@/hooks/useCategory'
import { CategroyItem } from '@/types/index'
import { DownOutlined } from '@ant-design/icons'
import { useCategorySettingContext } from './store'
import React from 'react'
import './style/index.module.scss'
import styles from './style/category-tree.module.scss'

const DEFAULT_ICON =
  'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://curlconverter.com/&size=16'

interface TreeNodeDataItem {
  title: React.ReactNode
  name: string
  key: number
  id: number
  children?: TreeNodeDataItem[]
  icon: React.ReactNode
  iconUrl?: string
}
const CategoryTree = () => {
  const { category, loading } = useCategory()
  const { treeSelected, setTreeSelected, setIsCreateCate } =
    useCategorySettingContext()

  const handleTreeSelect = (selectedKeys: React.Key[], e: any) => {
    setTreeSelected(e.selectedNodes)
    setIsCreateCate(false)
  }
  const renderTreeNodeIcon = (iconUrl: string) => {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
        <img style={{ width: '16px', height: '16px' }} src={iconUrl} alt="" />
      </div>
    )
  }
  const renderTreeNodeTitle = (item: CategroyItem) => {
    return (
      <div className={styles.treeNodeTitle}>
        {item.name}
        {item.level === 1 && (
          <span className={styles.treeNodeTitleAddWidget}>+</span>
        )}
      </div>
    )
  }
  const transformToTreeData = (
    list: CategroyItem[],
    level?: number
  ): DataNode[] => {
    return list.map((item) => {
      let _level = level ? level + 1 : 1
      return {
        title: renderTreeNodeTitle(item),
        name: item.name,
        key: item.id,
        id: item.id,
        children: item.children
          ? transformToTreeData(item.children, _level)
          : [],
        icon: renderTreeNodeIcon(item.icon || DEFAULT_ICON),
        iconUrl: item.icon || DEFAULT_ICON,
        level: _level,
      }
    })
  }
  const handleAddCategory = () => {
    setIsCreateCate(true)
  }
  const renderTree = () => {
    const disabledAddBtn = treeSelected?.[0]
      ? treeSelected[0].level === 2
      : false
    return (
      <div>
        <Tree
          showIcon
          defaultExpandAll
          switcherIcon={<DownOutlined />}
          treeData={transformToTreeData(category)}
          onSelect={handleTreeSelect}
          blockNode
          checkedKeys={treeSelected.map((item) => item.key)}
        />
        <Button
          disabled={disabledAddBtn}
          style={{ width: '100%', marginTop: '16px' }}
          onClick={handleAddCategory}
        >
          添加分类
        </Button>
      </div>
    )
  }
  return <>{!loading ? renderTree() : null}</>
}

export default CategoryTree

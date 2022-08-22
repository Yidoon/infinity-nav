import React, { useState } from 'react'

const useData = () => {
  const [treeSelected, setTreeSelected] = useState<any[]>([])
  const [isCreateCate, setIsCreateCate] = useState<boolean>(false)
  return {
    treeSelected,
    setTreeSelected,
    isCreateCate,
    setIsCreateCate,
  }
}
const CategroySettingContext = React.createContext<ReturnType<typeof useData>>(
  {} as any
)

export const useCategorySettingContext = () => {
  const state = React.useContext(CategroySettingContext)
  return state
}

const CategorySettingProvider: React.FC<any> = (props) => {
  const state = useData()

  return (
    <CategroySettingContext.Provider value={state}>
      {props.children}
    </CategroySettingContext.Provider>
  )
}

export default CategorySettingProvider

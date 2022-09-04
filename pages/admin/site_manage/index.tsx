import AdminLayout from '@/components/Layout/AdminLayout'
import { NextPageWithLayout } from 'pages/_app'
import React, { ReactElement } from 'react'

const SiteManagePage: NextPageWithLayout = () => {
  return <div>站点管理</div>
}

export default SiteManagePage

SiteManagePage.getLayout = (page: ReactElement) => {
  return <AdminLayout>{page}</AdminLayout>
}

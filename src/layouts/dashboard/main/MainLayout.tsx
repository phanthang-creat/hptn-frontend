import { FC, ReactNode, useState } from 'react'
import { Layout } from 'antd'
import clsx from 'clsx'
import { Sidebar, Header } from './components'

interface Props {
  children: ReactNode
}

const { Content } = Layout

const MainLayout: FC<Props> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false)

  return (
    <Layout>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      <Layout className={clsx('duration-200 transition-all', collapsed ? 'ml-[80px]' : 'ml-[250px]')}>
        {/* Header */}
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Content */}
        <Content className='p-4 min-h-[calc(100vh_-_64px)] bg-[#fafcfe]'>{children}</Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout

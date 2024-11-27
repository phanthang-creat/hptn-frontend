import { Tabs } from 'antd'
import { useGetHeadersQuery } from '~/stores/server/headerStore'
import { LogoTab, MenuTab, ButtonTab } from './components'

const HeaderManagementPage = () => {
  // Stores
  const getHeadersQuery = useGetHeadersQuery()

  return (
    <div>
      <h1 className='text-xl font-medium'>Quản lý header</h1>

      <Tabs
        defaultActiveKey='1'
        items={[
          {
            key: '1',
            label: 'Logo',
            children: <LogoTab data={getHeadersQuery.data} />
          },
          {
            key: '2',
            label: 'Menu',
            children: <MenuTab data={getHeadersQuery.data} />
          },
          {
            key: '3',
            label: 'Button',
            children: <ButtonTab data={getHeadersQuery.data} />
          }
        ]}
      />
    </div>
  )
}

export default HeaderManagementPage

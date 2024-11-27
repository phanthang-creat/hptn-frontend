import { Tabs } from 'antd'
import { useGetFootersQuery } from '~/stores/server/footerStore'
import { CommonTab, GeneralTab } from './components'

const FooterManagementPage = () => {
  // Stores
  const getFootersQuery = useGetFootersQuery()

  return (
    <div>
      <h1 className='text-xl font-medium'>Quản lý footer</h1>
      <Tabs
        defaultActiveKey='1'
        items={[
          {
            key: '1',
            label: 'Thông tin chung',
            children: <GeneralTab footerData={getFootersQuery.data} />
          },
          {
            key: '2',
            label: 'Theo dõi chúng tôi',
            children: <CommonTab footerData={getFootersQuery.data} code='FOLLOW_US' title='Theo dõi chúng tôi' />
          },
          {
            key: '3',
            label: 'Về chúng tôi',
            children: <CommonTab footerData={getFootersQuery.data} code='ABOUT_US' title='Về chúng tôi' />
          },
          {
            key: '4',
            label: 'Thông tin',
            children: <CommonTab footerData={getFootersQuery.data} code='INFORMATION' title='Thông tin' />
          }
        ]}
      />
    </div>
  )
}

export default FooterManagementPage

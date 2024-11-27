import { Dispatch, SetStateAction, FC, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Drawer, Menu, MenuProps } from 'antd'
import Logo from '~/assets/images/logo-transparent-256.png'
import { useGetHeadersQuery } from '~/stores/server/headerStore'
import './Sidebar.scss'

interface Props {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const SidebarTitle = (
  <Link to='/' className='flex items-center gap-2'>
    <img src={Logo} alt='' className='w-[32px] h-[32px] object-cover' />
    <h1 className='text-xl font-medium text-[#F1CA7B]'>PANO CHESS</h1>
  </Link>
)

const Sidebar: FC<Props> = ({ open, setOpen }) => {
  const navigate = useNavigate()

  // Stores
  const getHeadersQuery = useGetHeadersQuery()

  // States
  const [selectedKeys, setSelectedKeys] = useState<Array<string>>([])

  // Methods
  const handleClick: MenuProps['onClick'] = (e) => {
    setOpen(false)
    const menu = getHeadersQuery.data?.menus?.find((menu) => menu.key === e.key)
    if (menu) {
      navigate(menu.link)
    }
  }

  // useEffect
  useEffect(() => {
    const selectedMenu = getHeadersQuery.data?.menus?.find((menu) => menu.link === window.location.pathname)
    selectedMenu && setSelectedKeys([selectedMenu.id as string])
  }, [getHeadersQuery.data])

  return Array.isArray(getHeadersQuery.data?.menus) ? (
    <Drawer
      key='portal-main-layout-sidebar'
      rootClassName='portal-main-layout-sidebar'
      open={open}
      onClose={() => setOpen(false)}
      title={SidebarTitle}
      placement='left'
      width={250}
    >
      <Menu
        onClick={handleClick}
        mode='inline'
        selectedKeys={selectedKeys}
        onSelect={(event) => setSelectedKeys([event.key])}
        items={getHeadersQuery.data.menus
          .filter((menu) => menu.enabled)
          .sort((a, b) => a.order - b.order)
          .map((menu) => ({
            key: menu.id as string,
            label: menu.name
          }))}
      />
    </Drawer>
  ) : null
}

export default Sidebar

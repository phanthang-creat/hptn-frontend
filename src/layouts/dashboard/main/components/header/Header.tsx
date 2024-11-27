import { Dispatch, SetStateAction, FC } from 'react'
import { Layout, Button } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

interface Props {
  collapsed: boolean
  setCollapsed: Dispatch<SetStateAction<boolean>>
}

const { Header: LayoutHeader } = Layout

const Header: FC<Props> = ({ collapsed, setCollapsed }) => {
  return (
    <LayoutHeader className='sticky top-0 w-full p-0 h-header bg-[#333333] z-[999]'>
      <Button
        type='text'
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        className='text-base text-white/80 hover:!text-white hover:!bg-neutral-700 !w-[38px]'
      />
    </LayoutHeader>
  )
}

export default Header

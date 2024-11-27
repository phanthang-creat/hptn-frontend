import { FC, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import clsx from 'clsx'
import { v4 as uuidv4 } from 'uuid'
import Logo from '~/assets/images/logo-transparent-256.png'

interface Props {
  collapsed: boolean
}

const { Sider } = Layout

const MENUS = [
  {
    key: '/dashboard/page',
    // icon: <UserOutlined />,
    label: 'Trang'
  },
  {
    key: '/dashboard/header',
    // icon: <VideoCameraOutlined />,
    label: 'Header'
  },
  {
    key: '/dashboard/footer',
    // icon: <UploadOutlined />,
    label: 'Footer'
  },
  {
    key: uuidv4(),
    // icon: <UploadOutlined />,
    label: 'Danh sách trang',
    children: [
      {
        key: '/dashboard/home',
        // icon: <UploadOutlined />,
        label: 'Trang chủ'
      },
      {
        key: '/dashboard/introduction',
        // icon: <UploadOutlined />,
        label: 'Giới thiệu'
      },
      {
        key: '/dashboard/course',
        // icon: <UploadOutlined />,
        label: 'Khóa học'
      },
      {
        key: '/dashboard/chess-knowledge',
        // icon: <UploadOutlined />,
        label: 'Kiến thức cờ'
      },
      {
        key: '/dashboard/news',
        // icon: <UploadOutlined />,
        label: 'Tin tức'
      },
      {
        key: '/dashboard/recruitment',
        // icon: <UploadOutlined />,
        label: 'Tuyển dụng'
      },
      {
        key: '/dashboard/privacy-policy',
        // icon: <UploadOutlined />,
        label: 'Chính sách bảo mật'
      },
      {
        key: '/dashboard/terms-of-use',
        // icon: <UploadOutlined />,
        label: 'Điều khoản sử dụng'
      }
    ]
  },
  {
    key: uuidv4(),
    // icon: <UploadOutlined />,
    label: 'Quản lý bài viết',
    children: [
      {
        key: '/dashboard/post-category',
        // icon: <UploadOutlined />,
        label: 'Danh mục bài viết'
      },
      {
        key: '/dashboard/post',
        // icon: <UploadOutlined />,
        label: 'Bài viết'
      }
    ]
  },
  {
    key: uuidv4(),
    // icon: <UploadOutlined />,
    label: 'Tuyển dụng',
    children: [
      {
        key: '/dashboard/recruitment-post',
        // icon: <UploadOutlined />,
        label: 'Bài viết tuyển dụng'
      }
    ]
  },
  {
    key: uuidv4(),
    // icon: <UploadOutlined />,
    label: 'Quản lý sản phẩm',
    children: [
      {
        key: '/dashboard/product-category',
        // icon: <UploadOutlined />,
        label: 'Danh mục sản phẩm'
      },
      {
        key: '/dashboard/product',
        // icon: <UploadOutlined />,
        label: 'Sản phẩm'
      }
    ]
  },
  {
    key: '/dashboard/application',
    // icon: <UploadOutlined />,
    label: 'Đơn tuyển dụng'
  },
  {
    key: '/dashboard/game',
    // icon: <UploadOutlined />,
    label: 'Ván đấu'
  }
]

const Sidebar: FC<Props> = ({ collapsed }) => {
  const navigate = useNavigate()

  // States
  const [selectedKeys, setSelectedKeys] = useState<Array<string>>([])

  // useEffect
  useEffect(() => {
    let isFindMenu = false

    MENUS.forEach((menu) => {
      if (isFindMenu) {
        return
      }

      if (menu.key === window.location.pathname) {
        setSelectedKeys([menu.key])
        isFindMenu = true
        return
      }

      if (!menu.children) {
        return
      }

      menu.children.forEach((childMenu) => {
        if (isFindMenu) {
          return
        }
        if (childMenu.key === window.location.pathname) {
          isFindMenu = true
          setSelectedKeys([childMenu.key])
          return
        }
        return
      })
    })
  }, [])

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className='!fixed left-0 top-0 bottom-0 h-screen  !bg-white'
      width={250}
    >
      <div
        className={clsx(
          'h-16 bg-[#333333] flex items-center',
          collapsed ? 'justify-center pl-0' : 'justify-start pl-7'
        )}
      >
        <Link to='/dashboard' className='flex items-center gap-2'>
          <img src={Logo} alt='' className='w-[32px] h-[32px] object-cover' />
          <h1
            className={clsx(
              'text-xl font-medium text-[#F1CA7B] duration-200 transition',
              collapsed ? 'hidden opacity-0' : 'inline-block opacity-100'
            )}
          >
            PANO CHESS
          </h1>
        </Link>
      </div>

      <Menu
        mode='inline'
        selectedKeys={selectedKeys}
        onSelect={(event) => {
          setSelectedKeys([event.key])
          navigate(event.key)
        }}
        items={MENUS}
        className='h-[calc(100vh_-_64px)] overflow-auto'
      />
    </Sider>
  )
}

export default Sidebar

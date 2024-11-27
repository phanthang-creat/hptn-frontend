import { Dispatch, SetStateAction, FC } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { BarsIcon } from '~/components/icons'
import BASE_URLS from '~/configs/baseUrl'
import { useGetHeadersQuery } from '~/stores/server/headerStore'

interface Props {
  setIsOpenSidebar: Dispatch<SetStateAction<boolean>>
  setIsOpenRegistrationModal: Dispatch<SetStateAction<boolean>>
}

const Header: FC<Props> = ({ setIsOpenSidebar, setIsOpenRegistrationModal }) => {
  // Stores
  const getHeadersQuery = useGetHeadersQuery()

  return getHeadersQuery.data ? (
    <div
      className='
        sticky left-0 top-0 right-0
        bg-[#333333] z-[9999]'
    >
      <div
        className='
          pano-container
          h-header
          flex items-center gap-4 justify-between'
      >
        {/* Logo */}
        {getHeadersQuery.data.logo && (
          <Link to={getHeadersQuery.data.logo.link} className='flex items-center gap-2'>
            <img
              src={BASE_URLS.uploadEndPoint + getHeadersQuery.data.logo.image}
              alt=''
              className='w-[32px] h-[32px] object-cover'
            />
            <h1 className='text-xl font-medium text-[#F1CA7B]'>{getHeadersQuery.data.logo.label}</h1>
          </Link>
        )}

        {/* Menus */}
        <div className='hidden lg:flex items-center gap-6'>
          {Array.isArray(getHeadersQuery.data.menus) &&
            getHeadersQuery.data.menus
              .filter((menu) => menu.enabled)
              .sort((a, b) => a.order - b.order)
              .map((menu) => (
                <Link
                  to={menu.link}
                  target={menu.link.startsWith('http') ? '_blank' : '_self'}
                  key={menu.id}
                  className={clsx(
                    'relative duration-200 transition-colors',
                    window.location.pathname === menu.link
                      ? 'text-white after:content-[""] after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-[2px]  after:bg-white'
                      : 'text-white/80 hover:text-white'
                  )}
                >
                  {menu.name}
                </Link>
              ))}
        </div>

        {/* Button */}
        {getHeadersQuery.data.button && (
          <button
            onClick={() => setIsOpenRegistrationModal(true)}
            className='hidden lg:inline-block border-none outline-none px-4 py-2 rounded bg-[#F1CA7B] hover:opacity-80 duration-200 transition-opacity'
          >
            {getHeadersQuery.data.button.label}
          </button>
        )}

        {/* Bars icon */}
        <button className='inline-block lg:hidden text-white/80' onClick={() => setIsOpenSidebar(true)}>
          <BarsIcon />
        </button>
      </div>
    </div>
  ) : null
}

export default Header

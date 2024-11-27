/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BASE_URLS from '~/configs/baseUrl'
import { useGetFootersQuery } from '~/stores/server/footerStore'
import { PanoFooterSectionDataType } from '~/types/footerType'

interface CommonSectionProps {
  data: PanoFooterSectionDataType
}

const CommonSection: FC<CommonSectionProps> = ({ data }) => {
  return (
    <div className='px-2 w-1/2 sm:w-1/3 lg:w-1/5 flex flex-col'>
      <div className='text-white/80 text-base font-medium'>{data.title}</div>
      <div className='flex flex-col gap-2 mt-2'>
        {data.data
          .filter((item: any) => item.enabled)
          .sort((a: any, b: any) => a.order - b.order)
          .map((item: any) => (
            <Link
              key={item.id}
              to={item.link}
              target={item.link.startsWith('http') ? '_blank' : '_self'}
              className='
                flex items-center gap-2
              text-white/80 hover:text-white duration-200 transition-colors'
            >
              {item.image && (
                <img
                  src={BASE_URLS.uploadEndPoint + item.image}
                  alt=''
                  width={16}
                  height={16}
                  className='w-4 h-4 object-cover'
                />
              )}
              <span>{item.label}</span>
            </Link>
          ))}
      </div>
    </div>
  )
}

const Footer = () => {
  // Stores
  const getFootersQuery = useGetFootersQuery()

  // States
  const [generalSectionData, setGeneralSectionData] = useState<PanoFooterSectionDataType>()
  const [followUsSectionData, setFollowUsSectionData] = useState<PanoFooterSectionDataType>()
  const [aboutUsSectionData, setAboutUsSectionData] = useState<PanoFooterSectionDataType>()
  const [informationSectionData, setInformationSectionData] = useState<PanoFooterSectionDataType>()

  useEffect(() => {
    if (getFootersQuery.data) {
      getFootersQuery.data.forEach((section) => {
        switch (section.code) {
          case 'GENERAL':
            setGeneralSectionData(section)
            return
          case 'FOLLOW_US':
            setFollowUsSectionData(section)
            return
          case 'ABOUT_US':
            setAboutUsSectionData(section)
            return
          case 'INFORMATION':
            setInformationSectionData(section)
            return
          default:
            return
        }
      })
    }
  }, [getFootersQuery.data])

  return getFootersQuery.data ? (
    <div className='py-4 md:py-6 bg-[#333333]'>
      <div className='pano-container'>
        <div className='flex -mx-2 flex-wrap gap-y-6'>
          {/* General section */}
          {generalSectionData && (
            <div className='px-2 w-full flex flex-col gap-2'>
              <div className='flex items-center gap-2'>
                <img
                  src={BASE_URLS.uploadEndPoint + generalSectionData.data.logo}
                  alt=''
                  width={32}
                  height={32}
                  className='w-8 h-8 object-cover'
                />
                <span className='text-[#F1CA7B] text-xl font-medium'>{generalSectionData.data.name}</span>
              </div>

              <Link
                to={generalSectionData.data.googleMapLink}
                target='_blank'
                className='text-white/80 hover:text-white duration-200 transition-colors'
              >
                {generalSectionData.data.address}
              </Link>
            </div>
          )}

          {/* Follow us section */}
          {followUsSectionData && <CommonSection data={followUsSectionData} />}

          {/* Information section */}
          {informationSectionData && <CommonSection data={informationSectionData} />}

          {/*About us section */}
          {aboutUsSectionData && <CommonSection data={aboutUsSectionData} />}

          {/* Map */}
          {generalSectionData && (
            <div className='px-2 w-1/2 sm:w-full lg:w-2/5'>
              <iframe
                src={generalSectionData.data.googleMapEmbedSrc}
                width='100%'
                height='100%'
                style={{ border: 0, borderRadius: '4px' }}
                allowFullScreen={true}
                referrerPolicy='no-referrer-when-downgrade'
              />
            </div>
          )}
        </div>

        <div className='text-white/80 mt-6'>© panochess™ 2024. All rights reserved.</div>
      </div>
    </div>
  ) : null
}

export default Footer

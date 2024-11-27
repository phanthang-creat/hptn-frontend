import { Tabs } from 'antd'
import { useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { PanoJoditEditorContent } from '~/components'
import { PAGE_CODES } from '~/configs'
import { useGetPageByCodeQuery } from '~/stores/server/pageStore'
import { CoursePageSectionDataType } from '~/types/coursePageType'
import './coursePage.scss'

const CoursePage = () => {

  // Title
  document.title = 'Khóa học - Trung tâm cờ vua Pano Chess'

  // Stores
  const getPageByCodeQuery = useGetPageByCodeQuery({ code: PAGE_CODES.KHOA_HOC })

  // Memos
  const pageConfigData: Array<CoursePageSectionDataType> | null = useMemo(() => {
    try {
      if (!getPageByCodeQuery.data?.config) {
        return null
      }
      const parsedData: Array<CoursePageSectionDataType> = JSON.parse(getPageByCodeQuery.data.config)
      return Array.isArray(parsedData)
        ? parsedData.filter((item) => item.enabled).sort((a, b) => a.order - b.order)
        : null
    } catch (error) {
      return null
    }
  }, [getPageByCodeQuery.data])

  // Template
  return (
    <div className='portal-course-page pano-container py-8 flex flex-col gap-8'>
      {pageConfigData ? (
        <Tabs
          centered={window.innerWidth >= 1028}
          items={pageConfigData.map((item) => {
            return {
              key: item.id,
              label: item.title,
              children: (
                <div className='flex flex-col gap-8'>
                  <h2 className='pano-title'>{`Giới thiệu khoá ${item.title}`}</h2>
                  <PanoJoditEditorContent content={item.content} />
                </div>
              ),
              icon: item.icon ? <FontAwesomeIcon icon={item.icon as IconProp} /> : null
            }
          })}
        />
      ) : (
        <>
          <div className='flex gap-4'>
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className='flex-1 h-8 bg-neutral-300 animate-pulse'></div>
              ))}
          </div>

          <div className='flex flex-col gap-4 mt-4'>
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className='h-8 bg-neutral-300 animate-pulse'></div>
              ))}
          </div>
        </>
      )}
    </div>
  )
}

export default CoursePage

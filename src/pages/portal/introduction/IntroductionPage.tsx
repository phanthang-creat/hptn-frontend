import { useMemo } from 'react'
import { PanoJoditEditorContent } from '~/components'
import { BASE_URLS, PAGE_CODES } from '~/configs'
import { useGetPageByCodeQuery } from '~/stores/server/pageStore'
import { IntroductionPageConfigDataType } from '~/types/introductionPageType'

const IntroductionPage = () => {

  // Title
  document.title = 'Giới thiệu - Trung tâm cờ vua Pano Chess'

  // Stores
  const getPageByCodeQuery = useGetPageByCodeQuery({ code: PAGE_CODES.GIOI_THIEU })

  // Memos
  const pageConfigData: IntroductionPageConfigDataType | undefined = useMemo(() => {
    try {
      if (!getPageByCodeQuery.data?.config) {
        return undefined
      }

      const parsedData: IntroductionPageConfigDataType = JSON.parse(getPageByCodeQuery.data.config)
      return parsedData
    } catch (error) {
      return
    }
  }, [getPageByCodeQuery.data])

  // Template
  return (
    <div>
      {pageConfigData ? (
        <div>
          {/* Banner */}
          {pageConfigData.image && <img src={BASE_URLS.uploadEndPoint + pageConfigData.image} alt='' />}

          <div className='pano-container pb-8 pt-12'>
            {/* Title */}
            <div className='flex flex-col items-center gap-1 pano-title mb-8'>
              <div>GIỚI THIỆU</div>
              <div>TRUNG TÂM CỜ VUA PANO CHESS</div>
            </div>

            {/* Content */}
            <PanoJoditEditorContent content={pageConfigData.content} />
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          <div className='h-28 bg-neutral-300 animate-pulse'></div>

          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index} className='h-8 bg-neutral-300 animate-pulse'></div>
            ))}
        </div>
      )}
    </div>
  )
}

export default IntroductionPage

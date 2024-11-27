import { useMemo } from 'react'
import { PanoJoditEditorContent } from '~/components'
import { PAGE_CODES } from '~/configs'
import { useGetPageByCodeQuery } from '~/stores/server/pageStore'

const PrivacyPolicy = () => {
  // Stores
  const getPageByCodeQuery = useGetPageByCodeQuery({ code: PAGE_CODES.CHINH_SACH_BAO_MAT })

  // Title
  document.title = 'Chính sách bảo mật - Trung tâm cờ vua Pano Chess'

  // Memos
  const pageConfigData: string = useMemo(() => {
    if (!getPageByCodeQuery.data?.config) {
      return ''
    }
    return getPageByCodeQuery.data.config
  }, [getPageByCodeQuery.data])

  // Template
  return (
    <div className='pano-container py-8'>
      {pageConfigData ? (
        <PanoJoditEditorContent content={pageConfigData} />
      ) : (
        <div className='flex flex-col gap-4'>
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index} className='h-5 pano-animate-pulse'></div>
            ))}
        </div>
      )}
    </div>
  )
}

export default PrivacyPolicy

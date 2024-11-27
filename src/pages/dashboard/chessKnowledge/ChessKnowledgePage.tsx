import { useCallback, useEffect, useState } from 'react'
import { Tabs, notification } from 'antd'
import { useGetPageByCodeQuery, usePatchPageConfigByIdMutation } from '~/stores/server/pageStore'
import { PAGE_CODES } from '~/configs'
import { ChessKnowledge, EducationKnowledge } from './components/'
import { usePostUploadFilesMutation } from '~/stores/server/fileUploadStore'
import { ChessKnowledgePageConfigDataType } from '~/types/chessKnowledgePageType'
import { useGetPostCategoryQuery } from '~/stores/server/postCategoryStore'

const ChessKnowledgePage = () => {
  const [notificationApi, notificationContextHolder] = notification.useNotification()

  // Stores
  const postUploadFilesMutation = usePostUploadFilesMutation()
  const getPostCategoryQuery = useGetPostCategoryQuery()
  const getPageByCodeQuery = useGetPageByCodeQuery({ code: PAGE_CODES.KIEN_THUC_CO })
  const patchPageConfigByIdMutation = usePatchPageConfigByIdMutation({ code: PAGE_CODES.KIEN_THUC_CO })

  // States
  const [pageConfigData, setPageConfigData] = useState<ChessKnowledgePageConfigDataType | null>(null)

  // Methods
  const handleUpdatePageConfig = useCallback(
    async (config: string) => {
      try {
        if (!getPageByCodeQuery.data) {
          return
        }

        await patchPageConfigByIdMutation.mutateAsync({
          id: getPageByCodeQuery.data._id,
          config
        })
        return notificationApi.success({
          message: 'Thao tác thành công'
        })
      } catch (error) {
        return notificationApi.error({
          message: 'Thao tác thất bại'
        })
      }
    },
    [getPageByCodeQuery.data]
  )

  const handleUploadFile = useCallback(async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('files', file)
      const uploadFileResponse = await postUploadFilesMutation.mutateAsync(formData)
      return uploadFileResponse.data[0].path
    } catch (error) {
      notificationApi.error({
        message: 'Thao tác thất bại'
      })
      return null
    }
  }, [])

  // Effects
  useEffect(() => {
    try {
      if (!getPageByCodeQuery.data || !getPageByCodeQuery.data?.config) {
        return
      }

      const pageConfigData: ChessKnowledgePageConfigDataType = JSON.parse(getPageByCodeQuery.data.config)
      setPageConfigData(pageConfigData)
    } catch (error) {
      return
    }
  }, [getPageByCodeQuery.data])

  return (
    <div className='flex flex-col gap-4'>
      {notificationContextHolder}

      <h1 className='text-xl font-medium'>Quản lý trang Kiến thức cờ</h1>

      {getPageByCodeQuery.data && getPostCategoryQuery.data ? (
        <Tabs
          defaultActiveKey='1'
          items={[
            {
              key: '1',
              label: 'Kiến thức cờ',
              children: (
                <ChessKnowledge
                  pageConfigData={pageConfigData}
                  postCategoryData={getPostCategoryQuery.data}
                  loading={patchPageConfigByIdMutation.isPending || postUploadFilesMutation.isPending}
                  notificationApi={notificationApi}
                  onUpdatePageConfig={handleUpdatePageConfig}
                  onUploadFile={handleUploadFile}
                />
              )
            },
            {
              key: '2',
              label: 'Kiến thức giáo dục',
              children: (
                <EducationKnowledge
                  pageConfigData={pageConfigData}
                  postCategoryData={getPostCategoryQuery.data}
                  loading={patchPageConfigByIdMutation.isPending || postUploadFilesMutation.isPending}
                  onUpdatePageConfig={handleUpdatePageConfig}
                />
              )
            }
          ]}
        />
      ) : null}
    </div>
  )
}

export default ChessKnowledgePage

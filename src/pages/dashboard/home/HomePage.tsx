import { useState, useEffect, useCallback } from 'react'
import { Tabs, notification } from 'antd'
import {
  Banner,
  GeneralIntroduction,
  TreeDiagram,
  FirstInformation,
  SecondInformation,
  ChessNews,
  ActivityNews,
  OutstandingImages
} from './components'
import { HomePageConfigDataType } from '~/types/homePageType'
import { PAGE_CODES } from '~/configs'
import { useGetPageByCodeQuery, usePatchPageConfigByIdMutation } from '~/stores/server/pageStore'
import { usePostUploadFilesMutation } from '~/stores/server/fileUploadStore'
import { useGetPostCategoryQuery } from '~/stores/server/postCategoryStore'

const HomePage = () => {
  const [notificationApi, notificationContextHolder] = notification.useNotification()

  // Stores
  const getPostCategoryQuery = useGetPostCategoryQuery()
  const getPageByCodeQuery = useGetPageByCodeQuery({ code: PAGE_CODES.TRANG_CHU })
  const patchPageConfigByIdMutation = usePatchPageConfigByIdMutation({ code: PAGE_CODES.TRANG_CHU })
  const postUploadFilesMutation = usePostUploadFilesMutation()

  // States
  const [pageConfigData, setPageConfigData] = useState<HomePageConfigDataType | null>(null)

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

      const pageConfigData = JSON.parse(getPageByCodeQuery.data.config)
      setPageConfigData(pageConfigData)
    } catch (error) {
      return
    }
  }, [getPageByCodeQuery.data])

  // Template
  return getPageByCodeQuery.data ? (
    <div>
      {notificationContextHolder}

      <h1 className='text-xl font-medium'>Quản lý trang Trang chủ</h1>

      <Tabs
        defaultActiveKey='1'
        items={[
          {
            key: '1',
            label: 'Banner',
            children: (
              <Banner
                pageConfigData={pageConfigData}
                loading={patchPageConfigByIdMutation.isPending || postUploadFilesMutation.isPending}
                notificationApi={notificationApi}
                onUpdatePageConfig={handleUpdatePageConfig}
                onUploadFile={handleUploadFile}
              />
            )
          },
          {
            key: '2',
            label: 'Giới thiệu chung',
            children: (
              <GeneralIntroduction
                pageConfigData={pageConfigData}
                loading={patchPageConfigByIdMutation.isPending || postUploadFilesMutation.isPending}
                onUpdatePageConfig={handleUpdatePageConfig}
              />
            )
          },
          {
            key: '3',
            label: 'Sơ đồ cây',
            children: (
              <TreeDiagram
                pageConfigData={pageConfigData}
                loading={patchPageConfigByIdMutation.isPending || postUploadFilesMutation.isPending}
                notificationApi={notificationApi}
                onUpdatePageConfig={handleUpdatePageConfig}
                onUploadFile={handleUploadFile}
              />
            )
          },
          {
            key: '4',
            label: 'Thông tin 1',
            children: (
              <FirstInformation
                pageConfigData={pageConfigData}
                loading={patchPageConfigByIdMutation.isPending || postUploadFilesMutation.isPending}
                notificationApi={notificationApi}
                onUpdatePageConfig={handleUpdatePageConfig}
                onUploadFile={handleUploadFile}
              />
            )
          },
          {
            key: '5',
            label: 'Thông tin 2',
            children: (
              <SecondInformation
                pageConfigData={pageConfigData}
                loading={patchPageConfigByIdMutation.isPending || postUploadFilesMutation.isPending}
                onUpdatePageConfig={handleUpdatePageConfig}
              />
            )
          },
          {
            key: '6',
            label: 'Tin tức cờ',
            children: (
              <ChessNews
                pageConfigData={pageConfigData}
                loading={patchPageConfigByIdMutation.isPending || postUploadFilesMutation.isPending}
                onUpdatePageConfig={handleUpdatePageConfig}
                postCategoryData={getPostCategoryQuery.data}
              />
            )
          },
          {
            key: '7',
            label: 'Hoạt động',
            children: (
              <ActivityNews
                pageConfigData={pageConfigData}
                loading={patchPageConfigByIdMutation.isPending || postUploadFilesMutation.isPending}
                onUpdatePageConfig={handleUpdatePageConfig}
                postCategoryData={getPostCategoryQuery.data}
              />
            )
          },
          {
            key: '8',
            label: 'Hình ảnh nổi bật',
            children: (
              <OutstandingImages
                pageConfigData={pageConfigData}
                loading={patchPageConfigByIdMutation.isPending || postUploadFilesMutation.isPending}
                onUpdatePageConfig={handleUpdatePageConfig}
                onUploadFile={handleUploadFile}
              />
            )
          }
        ]}
      />
    </div>
  ) : null
}

export default HomePage

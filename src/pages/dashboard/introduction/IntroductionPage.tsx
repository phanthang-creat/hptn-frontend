import { useEffect, useState } from 'react'
import { Button, Upload, notification } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { PanoJoditEditor } from '~/components'
import { BASE_URLS, PAGE_CODES } from '~/configs'
import { handleBeforeUpload, handleChangeUploadImage } from '~/utils'
import { useGetPageByCodeQuery, usePatchPageConfigByIdMutation } from '~/stores/server/pageStore'
import { usePostUploadFilesMutation } from '~/stores/server/fileUploadStore'
import { IntroductionPageConfigDataType } from '~/types/introductionPageType'

const IntroductionPage = () => {
  const [notificationApi, notificationContextHolder] = notification.useNotification()

  // Stores
  const getPageByCodeQuery = useGetPageByCodeQuery({ code: PAGE_CODES.GIOI_THIEU })
  const patchPageConfigByIdMutation = usePatchPageConfigByIdMutation({ code: PAGE_CODES.GIOI_THIEU })
  const postUploadFilesMutation = usePostUploadFilesMutation()

  // States
  const [content, setContent] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null | string>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  // Methods
  const handleUploadFile = async (file: File) => {
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
  }

  const handleSubmit = async () => {
    try {
      if (!getPageByCodeQuery.data) {
        return
      }

      const imageUrl = imageFile instanceof File ? await handleUploadFile(imageFile) : imageFile
      if (!imageUrl) {
        return
      }

      await patchPageConfigByIdMutation.mutateAsync({
        id: getPageByCodeQuery.data._id,
        config: JSON.stringify({
          content,
          image: imageUrl
        })
      })
      return notificationApi.success({
        message: 'Thao tác thành công'
      })
    } catch (error) {
      return notificationApi.error({
        message: 'Thao tác thất bại'
      })
    }
  }

  // Effects
  useEffect(() => {
    try {
      if (!getPageByCodeQuery.data || !getPageByCodeQuery.data?.config) {
        return
      }

      const parsedPageConfig: IntroductionPageConfigDataType = JSON.parse(getPageByCodeQuery.data.config)
      setContent(parsedPageConfig.content ?? '')
      setImageUrl(parsedPageConfig?.image ? BASE_URLS.uploadEndPoint + parsedPageConfig.image : null)
      setImageFile(parsedPageConfig?.image ?? null)
    } catch (error) {
      return
    }
  }, [getPageByCodeQuery.data])

  return (
    <div className='flex flex-col items-start gap-4'>
      {notificationContextHolder}

      <h1 className='text-xl font-medium'>Quản lý trang Giới thiệu</h1>

      <Upload
        listType='picture-card'
        showUploadList={false}
        beforeUpload={handleBeforeUpload}
        onChange={(info) =>
          handleChangeUploadImage(info, notificationApi, () => {
            setImageUrl(window.URL.createObjectURL(info.file as unknown as File))
            setImageFile(info.file as unknown as File)
          })
        }
      >
        {imageUrl ? (
          <img src={imageUrl} alt='avatar' className='w-[100px] h-[100px] object-contain' />
        ) : (
          <div>
            <PlusOutlined />
            <div className='mt-2'>Upload</div>
          </div>
        )}
      </Upload>

      <PanoJoditEditor content={content} onChange={setContent} />

      <Button
        className='self-end'
        type='primary'
        htmlType='submit'
        loading={patchPageConfigByIdMutation.isPending || postUploadFilesMutation.isPending}
        onClick={handleSubmit}
      >
        Hoàn thành
      </Button>
    </div>
  )
}

export default IntroductionPage

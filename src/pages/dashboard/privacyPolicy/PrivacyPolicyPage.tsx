import { useEffect, useState } from 'react'
import { Button, notification } from 'antd'
import { PanoJoditEditor } from '~/components'
import { PAGE_CODES } from '~/configs'
import { useGetPageByCodeQuery, usePatchPageConfigByIdMutation } from '~/stores/server/pageStore'

const PrivacyPolicy = () => {
  const [notificationApi, notificationContextHolder] = notification.useNotification()

  // Stores
  const getPageByCodeQuery = useGetPageByCodeQuery({ code: PAGE_CODES.CHINH_SACH_BAO_MAT })
  const patchPageConfigByIdMutation = usePatchPageConfigByIdMutation({ code: PAGE_CODES.CHINH_SACH_BAO_MAT })

  // States
  const [pageConfigData, setPageConfigData] = useState<string>('')

  // Methods
  const handleSubmit = async () => {
    try {
      if (!getPageByCodeQuery.data) {
        return
      }

      await patchPageConfigByIdMutation.mutateAsync({
        id: getPageByCodeQuery.data._id,
        config: pageConfigData
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
    if (!getPageByCodeQuery.data || !getPageByCodeQuery.data?.config) {
      return
    }
    setPageConfigData(getPageByCodeQuery.data.config)
  }, [getPageByCodeQuery.data])

  return (
    <div className='flex flex-col items-start gap-4'>
      {notificationContextHolder}

      <h1 className='text-xl font-medium'>Quản lý trang Chính sách bảo mật</h1>

      <PanoJoditEditor content={pageConfigData} onChange={setPageConfigData} />

      <Button
        className='self-end'
        type='primary'
        htmlType='submit'
        loading={patchPageConfigByIdMutation.isPending}
        onClick={handleSubmit}
      >
        Hoàn thành
      </Button>
    </div>
  )
}

export default PrivacyPolicy

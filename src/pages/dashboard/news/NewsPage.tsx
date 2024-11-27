import { Button, Form, Select, notification } from 'antd'
import { useGetPostCategoryQuery } from '~/stores/server/postCategoryStore'
import { useGetPageByCodeQuery, usePatchPageConfigByIdMutation } from '~/stores/server/pageStore'
import { PAGE_CODES } from '~/configs'
import { useEffect } from 'react'
import { NewsPageConfigDataType } from '~/types/newsPageType'

interface FormFieldType {
  postCategoryId: string | null
}

const FORM_INITIAL_VALUES: FormFieldType = {
  postCategoryId: null
}

const NewsPage = () => {
  const [form] = Form.useForm<FormFieldType>()
  const [notificationApi, notificationContextHolder] = notification.useNotification()

  // Stores
  const getPostCategoryQuery = useGetPostCategoryQuery()
  const getPageByCodeQuery = useGetPageByCodeQuery({ code: PAGE_CODES.TIN_TUC })
  const patchPageConfigByIdMutation = usePatchPageConfigByIdMutation({ code: PAGE_CODES.TIN_TUC })

  // Methods
  const handleSubmit = async () => {
    try {
      if (!getPageByCodeQuery.data) {
        return
      }

      const formValues = form.getFieldsValue()

      const requestBody = {
        postCategorySlug: getPostCategoryQuery.data?.find((item) => item.id === formValues.postCategoryId)?.slug
      }

      await patchPageConfigByIdMutation.mutateAsync({
        id: getPageByCodeQuery.data._id,
        config: JSON.stringify(requestBody)
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
      if (!getPageByCodeQuery.data || !getPageByCodeQuery.data?.config || !getPostCategoryQuery.data) {
        return
      }

      const pageConfigData: NewsPageConfigDataType = JSON.parse(getPageByCodeQuery.data.config)
      console.log(getPostCategoryQuery.data?.find((item) => item.slug === pageConfigData.postCategorySlug)?.id)

      form.setFieldsValue({
        postCategoryId: pageConfigData?.postCategorySlug
          ? getPostCategoryQuery.data?.find((item) => item.slug === pageConfigData.postCategorySlug)?.id
          : null
      })
    } catch (error) {
      return
    }
  }, [getPageByCodeQuery.data, getPostCategoryQuery.data])

  return (
    <div className='flex flex-col gap-4'>
      {notificationContextHolder}

      <h1 className='text-xl font-medium'>Quản lý trang Tin tức</h1>

      {getPageByCodeQuery.data ? (
        <Form
          layout='vertical'
          form={form}
          initialValues={FORM_INITIAL_VALUES}
          onFinish={handleSubmit}
          className='grid grid-cols-2 grid-flow-row gap-x-4'
        >
          <Form.Item<FormFieldType>
            name='postCategoryId'
            label='Danh mục bài viết'
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn danh mục vài viết'
              }
            ]}
          >
            <Select
              showSearch
              placeholder='Danh mục bài viết'
              options={getPostCategoryQuery.data?.map((item) => ({
                value: item.id,
                label: item.name
              }))}
              filterOption={(input: string, option?: { label: string; value: string }) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item className='self-end text-right'>
            <Button type='primary' htmlType='submit' loading={patchPageConfigByIdMutation.isPending}>
              Hoàn thành
            </Button>
          </Form.Item>
        </Form>
      ) : null}
    </div>
  )
}

export default NewsPage

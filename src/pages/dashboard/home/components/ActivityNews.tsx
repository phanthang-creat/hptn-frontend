import { FC, useEffect } from 'react'
import { Input, Button, Form, Select, InputNumber } from 'antd'
import { HomePageConfigDataType } from '~/types/homePageType'
import { GetPostCategoryItemResponseDataType } from '~/types/postCategoryType'

interface Props {
  pageConfigData: HomePageConfigDataType | null
  loading: boolean
  postCategoryData?: Array<GetPostCategoryItemResponseDataType>
  onUpdatePageConfig: (config: string) => Promise<void>
}

interface FormFieldType {
  title: string
  postCategoryId: string | null
  quantity: number
}

const FORM_INITIAL_VALUES: FormFieldType = {
  title: '',
  postCategoryId: null,
  quantity: 2
}

const ActivityNews: FC<Props> = ({ pageConfigData, postCategoryData, loading, onUpdatePageConfig }) => {
  const [form] = Form.useForm<FormFieldType>()

  // Methods
  const handleSubmit = async () => {
    const formValues = form.getFieldsValue()

    const requestBody = {
      title: formValues.title.trim(),
      postCategorySlug: postCategoryData?.find((item) => item.id === formValues.postCategoryId)?.slug,
      quantity: formValues.quantity
    }

    // Handle update
    onUpdatePageConfig(
      JSON.stringify(
        pageConfigData
          ? { ...pageConfigData, activityNews: requestBody }
          : {
              activityNews: requestBody
            }
      )
    )
  }

  // Effects
  useEffect(() => {
    if (!pageConfigData || !pageConfigData.banner || !postCategoryData) {
      return
    }

    form.setFieldsValue({
      title: pageConfigData.activityNews?.title ?? '',
      postCategoryId: pageConfigData.activityNews?.postCategorySlug
        ? postCategoryData?.find((item) => item.slug === pageConfigData.activityNews.postCategorySlug)?.id
        : null,
      quantity: pageConfigData.activityNews?.quantity ?? 2
    })
  }, [pageConfigData, postCategoryData])

  // Template
  return (
    <Form
      layout='vertical'
      form={form}
      initialValues={FORM_INITIAL_VALUES}
      onFinish={handleSubmit}
      className='grid grid-cols-2 grid-flow-row gap-x-4'
    >
      <Form.Item<FormFieldType>
        label='Tiêu đề'
        name='title'
        rules={[
          { required: true, type: 'string', transform: (value) => value.trim(), message: 'Vui lòng nhập tiêu đề' }
        ]}
      >
        <Input />
      </Form.Item>

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
          options={postCategoryData?.map((item) => ({
            value: item.id,
            label: item.name
          }))}
          filterOption={(input: string, option?: { label: string; value: string }) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      </Form.Item>

      <Form.Item<FormFieldType>
        label='Số lượng tin hiển thị'
        name='quantity'
        rules={[{ required: true, type: 'number', message: 'Vui lòng nhập số lượng tin hiển thị' }]}
      >
        <InputNumber min={1} className='w-full' />
      </Form.Item>

      <Form.Item className='self-end col-span-2 text-right'>
        <Button type='primary' htmlType='submit' loading={loading}>
          Hoàn thành
        </Button>
      </Form.Item>
    </Form>
  )
}

export default ActivityNews

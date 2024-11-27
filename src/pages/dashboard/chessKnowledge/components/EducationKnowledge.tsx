import { FC, useEffect } from 'react'
import { Button, Form, Select } from 'antd'
import { ChessKnowledgePageConfigDataType } from '~/types/chessKnowledgePageType'
import { GetPostCategoryItemResponseDataType } from '~/types/postCategoryType'

interface Props {
  pageConfigData: ChessKnowledgePageConfigDataType | null
  postCategoryData?: Array<GetPostCategoryItemResponseDataType>
  loading: boolean
  onUpdatePageConfig: (config: string) => Promise<void>
}

interface FormFieldType {
  postCategoryId: string | null
}

const FORM_INITIAL_VALUES: FormFieldType = {
  postCategoryId: null
}

const EducationKnowledge: FC<Props> = ({ pageConfigData, postCategoryData, loading, onUpdatePageConfig }) => {
  const [form] = Form.useForm<FormFieldType>()

  // Methods
  const handleSubmit = async () => {
    const formValues = form.getFieldsValue()

    const requestBody = {
      postCategorySlug: postCategoryData?.find((item) => item.id === formValues.postCategoryId)?.slug
    }

    // Handle update
    onUpdatePageConfig(
      JSON.stringify(
        pageConfigData
          ? { ...pageConfigData, educationKnowledge: requestBody }
          : {
              educationKnowledge: requestBody
            }
      )
    )
  }

  // Effects
  useEffect(() => {
    if (!pageConfigData || !pageConfigData.chessKnowledge || !postCategoryData) {
      return
    }

    form.setFieldsValue({
      postCategoryId: pageConfigData.educationKnowledge?.postCategorySlug
        ? postCategoryData?.find((item) => item.slug === pageConfigData.educationKnowledge.postCategorySlug)?.id
        : null
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

      <Form.Item className='self-end text-right'>
        <Button type='primary' htmlType='submit' loading={loading}>
          Hoàn thành
        </Button>
      </Form.Item>
    </Form>
  )
}

export default EducationKnowledge

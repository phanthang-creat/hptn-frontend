/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, FC, useEffect } from 'react'
import { Upload, Button, Form } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { NotificationInstance } from 'antd/es/notification/interface'
import BASE_URLS from '~/configs/baseUrl'
import { HomePageConfigDataType } from '~/types/homePageType'
import { handleBeforeUpload, handleChangeUploadImage } from '~/utils'

interface Props {
  pageConfigData: HomePageConfigDataType | null
  loading: boolean
  notificationApi: NotificationInstance
  onUpdatePageConfig: (config: string) => Promise<void>
  onUploadFile: (file: File) => Promise<string | null>
}

interface FormFieldType {
  file: File | null | string
}

const FORM_INITIAL_VALUES: FormFieldType = {
  file: null
}

const TreeDiagram: FC<Props> = ({ pageConfigData, loading, notificationApi, onUpdatePageConfig, onUploadFile }) => {
  const [form] = Form.useForm<FormFieldType>()

  // States
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  // Methods
  const handleSubmit = async () => {
    const formValues = form.getFieldsValue()

    const imageUrl = formValues.file instanceof File ? await onUploadFile(formValues.file) : formValues.file
    if (!imageUrl) {
      return
    }

    onUpdatePageConfig(
      JSON.stringify(
        pageConfigData
          ? { ...pageConfigData, treeDiagram: imageUrl }
          : {
              treeDiagram: imageUrl
            }
      )
    )
  }

  // Effects
  useEffect(() => {
    if (!pageConfigData || !pageConfigData.treeDiagram) {
      return
    }

    form.setFieldsValue({
      file: pageConfigData.treeDiagram
    })

    setImageUrl(pageConfigData.treeDiagram ? BASE_URLS.uploadEndPoint + pageConfigData.treeDiagram : null)
  }, [pageConfigData, form])

  return (
    <Form
      layout='vertical'
      form={form}
      initialValues={FORM_INITIAL_VALUES}
      onFinish={handleSubmit}
      className='w-full flex flex-col'
    >
      <Form.Item<FormFieldType>
        label='Ảnh'
        name='file'
        valuePropName='file'
        getValueFromEvent={(e: any) => {
          return e?.file
        }}
        rules={[{ required: true, message: 'Vui lòng chọn ảnh' }]}
      >
        <Upload
          listType='picture-card'
          showUploadList={false}
          beforeUpload={handleBeforeUpload}
          onChange={(info) =>
            handleChangeUploadImage(info, notificationApi, () =>
              setImageUrl(window.URL.createObjectURL(info.file as unknown as File))
            )
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
      </Form.Item>

      <Form.Item className='self-end'>
        <Button type='primary' htmlType='submit' loading={loading}>
          Hoàn thành
        </Button>
      </Form.Item>
    </Form>
  )
}

export default TreeDiagram

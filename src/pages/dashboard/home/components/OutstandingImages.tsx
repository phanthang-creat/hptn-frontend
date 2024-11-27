import { FC, useEffect, useState } from 'react'
import { Upload, Button, Form, UploadFile, UploadProps } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
// import { NotificationInstance } from 'antd/es/notification/interface'
import { BASE_URLS } from '~/configs'
import { HomePageConfigDataType } from '~/types/homePageType'

interface Props {
  pageConfigData: HomePageConfigDataType | null
  loading: boolean

  onUpdatePageConfig: (config: string) => Promise<void>
  onUploadFile: (file: File) => Promise<string | null>
}

interface FormFieldType {
  file: File | null | string
}

const FORM_INITIAL_VALUES: FormFieldType = {
  file: null
}

const OutstandingImages: FC<Props> = ({ pageConfigData, loading, onUpdatePageConfig, onUploadFile }) => {
  const [form] = Form.useForm<FormFieldType>()

  // States
  const [fileList, setFileList] = useState<UploadFile[]>([])

  // Methods
  const handleSubmit = async () => {
    const uploadImageUrls = await Promise.all(
      fileList.map((file) =>
        file.originFileObj ? onUploadFile(file.originFileObj as File) : Promise.resolve(file.name)
      )
    )

    onUpdatePageConfig(
      JSON.stringify(
        pageConfigData
          ? { ...pageConfigData, outstandingImages: uploadImageUrls }
          : {
              treeDiagram: uploadImageUrls
            }
      )
    )
  }

  const handleChangeFileUpload: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList)

  // Effects
  useEffect(() => {
    if (!pageConfigData || !pageConfigData.outstandingImages) {
      return
    }

    setFileList(
      pageConfigData.outstandingImages.map((image) => ({
        uid: image,
        name: image,
        status: 'done',
        url: BASE_URLS.uploadEndPoint + image
      }))
    )
  }, [pageConfigData, form])

  return (
    <Form
      layout='vertical'
      form={form}
      initialValues={FORM_INITIAL_VALUES}
      onFinish={handleSubmit}
      className='w-full flex flex-col'
    >
      <Form.Item label='Danh sách hình ảnh'>
        <Upload
          listType='picture-card'
          fileList={fileList}
          beforeUpload={() => false}
          onChange={handleChangeFileUpload}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Tải ảnh</div>
          </div>
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

export default OutstandingImages

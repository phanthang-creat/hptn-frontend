/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, FC, useEffect } from 'react'
import { Input, Upload, Button, Form } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import BASE_URLS from '~/configs/baseUrl'
import { HomePageConfigDataType } from '~/types/homePageType'
import { handleBeforeUpload, handleChangeUploadImage } from '~/utils'
import { NotificationInstance } from 'antd/es/notification/interface'

interface Props {
  pageConfigData: HomePageConfigDataType | null
  loading: boolean
  notificationApi: NotificationInstance
  onUpdatePageConfig: (config: string) => Promise<void>
  onUploadFile: (file: File) => Promise<string | null>
}

interface FormFieldType {
  file: File | null | string
  title: string
  subTitle: string
  buttonText: string
  buttonLink: string
}

const FORM_INITIAL_VALUES: FormFieldType = {
  file: null,
  title: '',
  subTitle: '',
  buttonText: '',
  buttonLink: ''
}

const Banner: FC<Props> = ({ pageConfigData, loading, notificationApi, onUpdatePageConfig, onUploadFile }) => {
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

    const bannerData = {
      image: imageUrl,
      title: formValues.title.trim(),
      subTitle: formValues.subTitle.trim(),
      buttonText: formValues.buttonText.trim(),
      buttonLink: formValues.buttonLink.trim()
    }

    // Handle update
    onUpdatePageConfig(
      JSON.stringify(
        pageConfigData
          ? { ...pageConfigData, banner: bannerData }
          : {
              banner: bannerData
            }
      )
    )
  }

  // Effects
  useEffect(() => {
    if (!pageConfigData || !pageConfigData.banner) {
      return
    }

    form.setFieldsValue({
      file: pageConfigData.banner?.image ?? null,
      title: pageConfigData.banner?.title ?? '',
      subTitle: pageConfigData.banner?.subTitle ?? '',
      buttonText: pageConfigData.banner?.buttonText ?? '',
      buttonLink: pageConfigData.banner?.buttonLink ?? ''
    })

    setImageUrl(pageConfigData.banner?.image ? BASE_URLS.uploadEndPoint + pageConfigData.banner.image : null)
  }, [pageConfigData])

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

      <div className='grid grid-cols-2 gap-x-4'>
        <Form.Item<FormFieldType>
          label='Tiêu đề'
          name='title'
          rules={[{ required: true, transform: (value) => value.trim(), message: 'Vui lòng nhập tiêu đề' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FormFieldType>
          label='Tiêu đề phụ'
          name='subTitle'
          rules={[{ required: true, transform: (value) => value.trim(), message: 'Vui lòng nhập tiêu đề phụ' }]}
        >
          <Input />
        </Form.Item>
      </div>

      <div className='grid grid-cols-2 gap-x-4'>
        <Form.Item<FormFieldType>
          label='Tiêu đề nút'
          name='buttonText'
          rules={[{ required: true, transform: (value) => value.trim(), message: 'Vui lòng nhập tiêu đề nút' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FormFieldType>
          label='Đường dẫn'
          name='buttonLink'
          rules={[{ required: true, transform: (value) => value.trim(), message: 'Vui lòng nhập đường dẫn' }]}
        >
          <Input />
        </Form.Item>
      </div>

      <Form.Item className='self-end'>
        <Button type='primary' htmlType='submit' loading={loading}>
          Hoàn thành
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Banner

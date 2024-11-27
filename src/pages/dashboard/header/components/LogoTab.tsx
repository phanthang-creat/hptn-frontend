import { useState, FC, useEffect } from 'react'
import { Input, Upload, Button, Form, notification } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { PanoHeaderDataType } from '~/types/headerType'
import BASE_URLS from '~/configs/baseUrl'
import { handleBeforeUpload, handleChangeUploadImage } from '~/utils'
import { usePatchHeadersMutation } from '~/stores/server/headerStore'
import { usePostUploadFilesMutation } from '~/stores/server/fileUploadStore'

interface Props {
  data?: PanoHeaderDataType
}

interface FormFieldType {
  file: File | null | string
  label: string
  link: string
}

const FORM_INITIAL_VALUES: FormFieldType = {
  file: null,
  label: '',
  link: ''
}

const LogoTab: FC<Props> = ({ data }) => {
  const [notificationApi, notificationContextHolder] = notification.useNotification()
  const [form] = Form.useForm<FormFieldType>()

  // Stores
  const patchHeadersMutation = usePatchHeadersMutation()
  const postUploadFilesMutation = usePostUploadFilesMutation()

  // States
  const [imageUrl, setImageUrl] = useState<string | null>(data?.logo?.image ? data?.logo?.image : null)

  // Methods
  const handleSubmit = async () => {
    const formValues = form.getFieldsValue()

    try {
      let logoImage = formValues.file
      if (formValues.file instanceof File) {
        // Handle upload file
        const formData = new FormData()
        formData.append('files', formValues.file)
        const uploadFileResponse = await postUploadFilesMutation.mutateAsync(formData)
        logoImage = uploadFileResponse.data[0].path
      }

      // Handle update logo
      await patchHeadersMutation.mutateAsync(
        JSON.stringify({
          data: {
            ...data,
            logo: {
              label: formValues.label.trim(),
              link: formValues.link.trim(),
              image: logoImage
            }
          }
        })
      )

      form.resetFields()
      return notificationApi.success({
        message: 'Chỉnh sửa thông tin thành công'
      })
    } catch (error) {
      return notificationApi.error({
        message: 'Chỉnh sửa thông tin thất bại'
      })
    }
  }

  // useEffect
  useEffect(() => {
    if (data?.logo) {
      form.setFieldsValue({
        file: data.logo.image ?? null,
        label: data.logo.label,
        link: data.logo.link
      })

      setImageUrl(data?.logo.image ? BASE_URLS.uploadEndPoint + data.logo.image : null)
    }
  }, [data])

  return (
    <>
      {notificationContextHolder}
      <Form
        layout='vertical'
        form={form}
        initialValues={FORM_INITIAL_VALUES}
        onFinish={handleSubmit}
        className='w-full flex flex-col'
      >
        <Form.Item<FormFieldType>
          label='Ảnh logo'
          name='file'
          valuePropName='file'
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          getValueFromEvent={(e: any) => {
            return e?.file
          }}
          rules={[{ required: true, message: 'Vui lòng chọn ảnh logo' }]}
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
              <img src={imageUrl} alt='avatar' className='w-[100px] h-[100px] object-cover' />
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
            label='Tiêu đề logo'
            name='label'
            rules={[{ required: true, transform: (value) => value.trim(), message: 'Vui lòng nhập tiêu đề logo' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FormFieldType>
            label='Đường dẫn'
            name='link'
            rules={[{ required: true, transform: (value) => value.trim(), message: 'Vui lòng nhập đường dẫn' }]}
          >
            <Input />
          </Form.Item>
        </div>

        <Form.Item className='self-end'>
          <Button
            type='primary'
            htmlType='submit'
            loading={postUploadFilesMutation.isPending || patchHeadersMutation.isPending}
          >
            Hoàn thành
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default LogoTab

import { FC, useEffect, useState } from 'react'
import { Input, Upload, Button, Form, notification } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { PanoFooterSectionDataType } from '~/types/footerType'
import BASE_URLS from '~/configs/baseUrl'
import { handleBeforeUpload, handleChangeUploadImage } from '~/utils'
import { usePatchFootersMutation } from '~/stores/server/footerStore'
import { usePostUploadFilesMutation } from '~/stores/server/fileUploadStore'

interface Props {
  footerData?: PanoFooterSectionDataType[]
}

interface FormFieldType {
  logo: File | null | string
  name: string
  address: string
  googleMapLink: string
  googleMapEmbedSrc: string
}

const FORM_INITIAL_VALUES: FormFieldType = {
  logo: null,
  name: '',
  address: '',
  googleMapLink: '',
  googleMapEmbedSrc: ''
}

const GeneralTab: FC<Props> = ({ footerData }) => {
  const [notificationApi, notificationContextHolder] = notification.useNotification()
  const [form] = Form.useForm<FormFieldType>()

  // Stores
  const patchFootersMutation = usePatchFootersMutation()
  const postUploadFilesMutation = usePostUploadFilesMutation()

  const sectionData = Array.isArray(footerData) ? footerData.find((item) => item.code === 'GENERAL') : undefined

  // States
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  // Methods
  const handleSubmit = async () => {
    const formValues = form.getFieldsValue()

    try {
      let imageUrl = formValues.logo
      if (formValues.logo instanceof File) {
        // Handle upload file
        const formData = new FormData()
        formData.append('files', formValues.logo)
        const uploadFileResponse = await postUploadFilesMutation.mutateAsync(formData)
        imageUrl = uploadFileResponse.data[0].path
      }

      // Handle update
      const tempFooterData = Array.isArray(footerData) ? [...footerData] : []
      const newData = {
        logo: imageUrl,
        name: formValues.name.trim(),
        address: formValues.address.trim(),
        googleMapLink: formValues.googleMapLink.trim(),
        googleMapEmbedSrc: formValues.googleMapEmbedSrc.trim()
      }

      const bodyData = sectionData
        ? tempFooterData.map((section) =>
            section.code === 'GENERAL'
              ? {
                  ...section,
                  data: newData
                }
              : section
          )
        : tempFooterData.push({
            code: 'GENERAL',
            title: 'Thông tin chung',
            data: newData
          })

      await patchFootersMutation.mutateAsync(
        JSON.stringify({
          data: bodyData
        })
      )

      return notificationApi.success({
        message: 'Chỉnh sửa thông tin thành công'
      })
    } catch (error) {
      return notificationApi.error({
        message: 'Chỉnh sửa thông tin thất bại'
      })
    }
  }

  // Effects
  useEffect(() => {
    if (sectionData?.data) {
      form.setFieldsValue({
        logo: sectionData.data.logo ?? null,
        name: sectionData.data?.name,
        address: sectionData.data.address,
        googleMapLink: sectionData.data.googleMapLink,
        googleMapEmbedSrc: sectionData.data.googleMapEmbedSrc
      })

      setImageUrl(sectionData.data.logo ? BASE_URLS.uploadEndPoint + sectionData.data.logo : null)
    }
  }, [sectionData])

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
          label='Ảnh'
          name='logo'
          valuePropName='file'
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            name='name'
            rules={[{ required: true, transform: (value) => value.trim(), message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FormFieldType>
            label='Địa chỉ'
            name='address'
            rules={[{ required: true, transform: (value) => value.trim(), message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className='grid grid-cols-2 gap-x-4'>
          <Form.Item<FormFieldType>
            label='Đường dẫn google map'
            name='googleMapLink'
            rules={[
              { required: true, transform: (value) => value.trim(), message: 'Vui lòng nhập đường dẫn google map' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FormFieldType>
            label='Nguồn nhúng google map'
            name='googleMapEmbedSrc'
            rules={[
              { required: true, transform: (value) => value.trim(), message: 'Vui lòng nhập nguồn nhúng google map' }
            ]}
          >
            <Input />
          </Form.Item>
        </div>

        <Form.Item className='self-end'>
          <Button
            type='primary'
            htmlType='submit'
            loading={postUploadFilesMutation.isPending || patchFootersMutation.isPending}
          >
            Hoàn thành
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default GeneralTab

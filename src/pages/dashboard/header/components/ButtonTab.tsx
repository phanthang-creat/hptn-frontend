import { FC, useEffect } from 'react'
import { Input, Button, Form, notification } from 'antd'
import { PanoHeaderDataType, PanoHeaderLogoType } from '~/types/headerType'
import { usePatchHeadersMutation } from '~/stores/server/headerStore'

interface Props {
  data?: PanoHeaderDataType
}

const FORM_INITIAL_VALUES = {
  label: '',
  link: ''
}

const ButtonTab: FC<Props> = ({ data }) => {
  const [form] = Form.useForm<PanoHeaderLogoType>()
  const [notificationApi, notificationContextHolder] = notification.useNotification()

  // Stores
  const patchHeadersMutation = usePatchHeadersMutation()

  // Methods
  const handleSubmit = async () => {
    const formValues = form.getFieldsValue()

    try {
      await patchHeadersMutation.mutateAsync(
        JSON.stringify({
          data: {
            ...data,
            button: formValues
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
    if (data?.button) {
      form.setFieldsValue(data?.button)
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
        <div className='grid grid-cols-2 gap-x-4'>
          <Form.Item<PanoHeaderLogoType>
            label='Tiêu đề'
            name='label'
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<PanoHeaderLogoType>
            label='Đường dẫn'
            name='link'
            rules={[{ required: true, message: 'Vui lòng nhập đường dẫn' }]}
          >
            <Input />
          </Form.Item>
        </div>

        <Form.Item className='self-end'>
          <Button type='primary' htmlType='submit' loading={patchHeadersMutation.isPending}>
            Hoàn thành
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default ButtonTab

import { FC, ReactNode, useState, createContext } from 'react'
import { Form, Input, InputNumber, Modal, Select, notification } from 'antd'
import { Header, Sidebar, Footer } from './components'
import { PostTrialRegistrationRequestBodyType } from '~/types/trialRegistrationType'
import { useGetTrialCourseQuery } from '~/stores/server/trialCourseStore'
import { usePostTrialRegistrationMutation } from '~/stores/server/trialRegistrationStore'
import './mainLayout.scss'

interface Props {
  children: ReactNode
}

interface FormFieldType {
  studentName: string
  studentAge?: number
  parentName: string
  parentPhone: string
  trialCourseId?: number
}

const FORM_INITIAL_VALUES: FormFieldType = {
  studentName: '',
  studentAge: undefined,
  parentName: '',
  parentPhone: '',
  trialCourseId: undefined
}

const MainLayoutContext = createContext({
  setIsOpenRegistrationModal: (state: boolean) => {
    console.log(state)
  }
})

const MainLayout: FC<Props> = ({ children }) => {
  const [form] = Form.useForm<FormFieldType>()
  const [notificationApi, notificationContextHolder] = notification.useNotification()

  // States
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false)
  const [isOpenRegistrationModal, setIsOpenRegistrationModal] = useState<boolean>(false)

  // Stores
  const getTrialCourseQuery = useGetTrialCourseQuery()
  const postTrialRegistrationMutation = usePostTrialRegistrationMutation()

  // Methods
  const handleCancelRegistration = () => {
    form.resetFields()
    setIsOpenRegistrationModal(false)
  }

  const handleSubmitRegistration = async () => {
    try {
      const formFieldValues = form.getFieldsValue()
      await postTrialRegistrationMutation.mutateAsync(formFieldValues as PostTrialRegistrationRequestBodyType)
      handleCancelRegistration()
      notificationApi.success({
        message: 'Đăng ký thành công'
      })
    } catch (error) {
      notificationApi.error({
        message: 'Có lỗi xảy ra, vui lòng thử lại'
      })
    }
  }

  return (
    <MainLayoutContext.Provider value={{ setIsOpenRegistrationModal }}>
      <div className='portal-main-layout min-h-screen flex flex-col items-stretch'>
        {notificationContextHolder}
        <Header setIsOpenSidebar={setIsOpenSidebar} setIsOpenRegistrationModal={setIsOpenRegistrationModal} />
        <Sidebar open={isOpenSidebar} setOpen={setIsOpenSidebar} />
        <div className='flex-1 bg-[#fafcfe]'>{children}</div>
        <Footer />

        {/* Register modal */}
        <Modal
          title={'Đăng ký học thử'}
          open={isOpenRegistrationModal}
          maskClosable={false}
          width={1000}
          okText='Hoàn thành'
          cancelText='Hủy'
          onOk={() => form.submit()}
          confirmLoading={postTrialRegistrationMutation.isPending}
          onCancel={handleCancelRegistration}
        >
          <Form
            form={form}
            initialValues={FORM_INITIAL_VALUES}
            layout='vertical'
            onFinish={handleSubmitRegistration}
            className='grid grid-cols-1 lg:grid-cols-2 grid-flow-row gap-x-4'
          >
            <Form.Item<FormFieldType>
              name='studentName'
              label='Tên học viên'
              rules={[
                {
                  required: true,
                  type: 'string',
                  transform: (value) => value.trim(),
                  message: 'Vui lòng nhập tên học viên'
                }
              ]}
            >
              <Input placeholder='Tên học viên' />
            </Form.Item>

            <Form.Item<FormFieldType>
              name='studentAge'
              label='Tuổi học viên'
              rules={[
                {
                  required: true,
                  type: 'number',
                  message: 'Vui lòng nhập tuổi học viên'
                }
              ]}
            >
              <InputNumber placeholder='Tuổi học viên' className='w-full' />
            </Form.Item>

            <Form.Item<FormFieldType>
              name='parentName'
              label='Tên phụ huynh'
              rules={[
                {
                  required: true,
                  type: 'string',
                  message: 'Vui lòng nhập tên phụ huynh'
                }
              ]}
            >
              <Input placeholder='Tên phụ huynh' />
            </Form.Item>

            <Form.Item<FormFieldType>
              name='parentPhone'
              label='Số điện thoại phụ huynh'
              rules={[
                {
                  required: true,
                  type: 'string',
                  message: 'Vui lòng nhập số điện thoại phụ huynh'
                }
              ]}
            >
              <Input placeholder='Số điện thoại' />
            </Form.Item>

            <Form.Item<FormFieldType>
              name='trialCourseId'
              label='Khóa học'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn khóa học'
                }
              ]}
            >
              <Select
                showSearch
                placeholder='Khóa học'
                options={getTrialCourseQuery.data?.map((item) => ({
                  value: item.id,
                  label: item.name
                }))}
                filterOption={(input: string, option?: { label: string; value: string }) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </MainLayoutContext.Provider>
  )
}

export default MainLayout
export { MainLayoutContext }

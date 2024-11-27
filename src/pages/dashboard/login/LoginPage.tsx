import { useNavigate, useLocation } from 'react-router-dom'
import { Input, Form, Button, notification } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { usePostAuthLoginMutation } from '~/stores/server/authenticationStore'
import './LoginPage.scss'

interface FormValues {
  username: string
  password: string
}

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [api, contextHolder] = notification.useNotification()

  //  Stores
  const postAuthLoginMutation = usePostAuthLoginMutation()

  const onFinish = async (values: FormValues) => {
    try {
      await postAuthLoginMutation.mutateAsync(values)
      return navigate(location.state?.['from'] ?? '/dashboard')
    } catch (error) {
      return api.error({
        message: 'Đăng nhập thất bại'
      })
    }
  }

  return (
    <>
      {contextHolder}
      <div
        className="
        dashboard-login-page
        fixed top-0 right-0 bottom-0 left-0 
        bg-[url('~/assets/images/auth_bg.png')] bg-cover bg-center
        "
      >
        <div className='h-full backdrop-blur-[2px] flex'>
          <div className='m-auto w-[400px] bg-white rounded p-8 flex flex-col gap-4'>
            <h2 className='text-[#b45f06] text-xl font-medium text-center'>ĐĂNG NHẬP</h2>

            <Form onFinish={onFinish} layout='vertical'>
              <Form.Item
                name='username'
                label='Tên đăng nhập'
                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
              >
                <Input prefix={<UserOutlined />} placeholder='Tên đăng nhập' />
              </Form.Item>
              <Form.Item
                name='password'
                label='Mật khẩu'
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
              >
                <Input prefix={<LockOutlined />} type='password' placeholder='Mật khẩu' />
              </Form.Item>
              <Form.Item className='mb-0'>
                <div className='flex justify-center'>
                  <Button type='primary' htmlType='submit' loading={postAuthLoginMutation.isPending}>
                    Đăng nhập
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage

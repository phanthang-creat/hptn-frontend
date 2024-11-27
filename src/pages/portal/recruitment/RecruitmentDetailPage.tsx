/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Button, DatePicker, Form, Input, Upload, notification } from 'antd'
import { UploadOutlined, LinkOutlined } from '@ant-design/icons'
import { faBriefcase, faClock, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dayjs, { Dayjs } from 'dayjs'
import { Link, useParams } from 'react-router-dom'
import { PanoImage, PanoJoditEditorContent } from '~/components'
import { BASE_URLS } from '~/configs'
import { useGetRecruitmentQuery, useGetRecruitmentBySlugQuery } from '~/stores/server/recruitmentStore'
import { usePostUploadFilesCvMutation } from '~/stores/server/fileUploadStore'
import { usePostApplicationMutation } from '~/stores/server/applicationStore'
import { PostApplicationRequestBodyType } from '~/types/applicationType'
import './recruitmentDetailPage.scss'

interface FormType {
  name: string
  email: string
  phone: string
  address: string
  birthday: Dayjs | null
  resume: File | null
}

const FORM_INITIAL_VALUES = {
  name: '',
  email: '',
  phone: '',
  address: '',
  birthday: null,
  resume: null
}

const RecruitmentDetailPage = () => {
  const { slug } = useParams()
  const [form] = Form.useForm<FormType>()
  const [notificationApi, notificationContextHolder] = notification.useNotification()

  //title
  document.title = 'Chi tiết tuyển dụng - Trung tâm cờ vua Pano Chess'

  // States
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  // Stores
  const getRecruitmentBySlugQuery = useGetRecruitmentBySlugQuery({
    slug
  })
  const getRecruitmentQuery = useGetRecruitmentQuery({
    take: 3,
    enabled: true,
    excludeSlug: slug
  })
  const postUploadFilesCvMutation = usePostUploadFilesCvMutation()
  const postApplicationMutation = usePostApplicationMutation()

  // Methods
  const handleSubmitForm = async () => {
    try {
      const formValues = form.getFieldsValue()
      // Upload file
      const formData = new FormData()
      formData.append('file', formValues.resume as File)
      const uploadFileResponse = await postUploadFilesCvMutation.mutateAsync(formData)

      // Post application
      const postApplicationRequestBody: PostApplicationRequestBodyType = {
        fullName: formValues.name.trim(),
        email: formValues.email.trim(),
        phone: formValues.phone.trim(),
        dateOfBirth: formValues.birthday?.toISOString() as string,
        address: formValues.address.trim(),
        cv: uploadFileResponse.data.path,
        recruitmentId: getRecruitmentBySlugQuery.data?.id as string,
        description: ''
      }

      await postApplicationMutation.mutateAsync(postApplicationRequestBody)
      form.resetFields()
      setResumeFile(null)
      return notificationApi.success({
        message: 'Ứng tuyển thành công'
      })
    } catch (error) {
      return notificationApi.error({
        message: 'Ứng tuyển thất bại'
      })
    }
  }

  // Template
  return (
    <div className='pano-container py-8 portal-recruitment-detail-page'>
      {notificationContextHolder}

      <div className='flex flex-col lg:flex-row flex-wrap gap-y-4 -mx-4'>
        {/* Recruitment detail */}
        {getRecruitmentBySlugQuery.data ? (
          <div className='px-4 w-full lg:w-2/3 flex flex-col gap-4'>
            <h2 className='text-base sm:text-xl lg:text-3xl font-medium'>{getRecruitmentBySlugQuery.data.title}</h2>
            <p className='text-[#525252]'>
              Đăng ngày {dayjs(getRecruitmentBySlugQuery.data.createdAt).format('DD/MM/YYYY')}
            </p>
            <div className='text-[#525252] italic flex items-center gap-2'>
              <FontAwesomeIcon icon={faBriefcase} width={14} />
              <span className='flex-1'>Vị trí tuyển dụng: {getRecruitmentBySlugQuery.data.position.name}</span>
            </div>
            <div className='text-[#525252] italic flex items-center gap-2'>
              <FontAwesomeIcon icon={faClock} width={14} />
              <span className='flex-1'>Loại tuyển dụng: {getRecruitmentBySlugQuery.data.type.name}</span>
            </div>
            <div className='text-[#525252] italic flex items-center gap-2'>
              <FontAwesomeIcon icon={faLocationDot} width={14} />
              <span className='flex-1'>Địa chỉ: {getRecruitmentBySlugQuery.data.address}</span>
            </div>
            <PanoJoditEditorContent content={getRecruitmentBySlugQuery.data.content} />
          </div>
        ) : (
          <div className='px-4 w-full lg:w-2/3 flex flex-col gap-4'>
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className='h-8 bg-neutral-300 rounded animate-pulse'></div>
              ))}
          </div>
        )}

        <div className='px-4 w-full lg:w-1/3 flex flex-col gap-8'>
          {/* View more */}
          <div className='flex flex-col gap-4'>
            <h2 className='text-base sm:text-xl font-medium'>Xem thêm</h2>
            {getRecruitmentQuery.data ? (
              <>
                {getRecruitmentQuery.data.data.length === 0 && <div>Không có bài tuyển dụng nào.</div>}

                {getRecruitmentQuery.data.data.length > 0 &&
                  getRecruitmentQuery.data?.data.map((post) => (
                    <Link key={post.id} to={`/tuyen-dung/${post.slug}`} className='flex gap-4 items-start'>
                      <PanoImage
                        src={BASE_URLS.uploadEndPoint + post.image}
                        containerClassNames='rounded overflow-hidden aspect-square w-[100px]'
                        imgClassNames='object-fill'
                      />
                      {/* <img
                        src={BASE_URLS.uploadEndPoint + post.image}
                        alt=''
                        width={100}
                        height={100}
                        className='object-cover rounded'
                      /> */}
                      <div className='flex-1 flex flex-col gap-1 items-start'>
                        <h3 className='text-base font-medium line-clamp-1'>{post.title}</h3>
                        <div className='text-[#525252] italic flex items-center gap-2'>
                          <FontAwesomeIcon icon={faBriefcase} width={14} />
                          <span className='flex-1 line-clamp-1'>Vị trí tuyển dụng: {post.position.name}</span>
                        </div>
                        <div className='text-[#525252] italic flex items-center gap-2'>
                          <FontAwesomeIcon icon={faClock} width={14} />
                          <span className='flex-1 line-clamp-1'>Loại tuyển dụng: {post.type.name}</span>
                        </div>
                        <div className='text-[#525252] italic flex items-center gap-2'>
                          <FontAwesomeIcon icon={faLocationDot} width={14} />
                          <span className='flex-1 line-clamp-1'>Địa chỉ: {post.address}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </>
            ) : (
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className='flex gap-4 items-center'>
                    <div className='w-[100px] h-[100px] rounded animate-pulse bg-neutral-300'></div>
                    <div className='flex-1 flex flex-col gap-1 items-stretch'>
                      {Array(4)
                        .fill(0)
                        .map((_, index) => (
                          <div key={index} className='w-full h-5 bg-neutral-300 animate-pulse rounded'></div>
                        ))}
                    </div>
                  </div>
                ))
            )}
          </div>

          {/* Recruitment form */}
          <div className='flex flex-col gap-4'>
            <h2 className='text-base sm:text-xl font-medium'>Ứng tuyển</h2>
            <Form
              form={form}
              initialValues={FORM_INITIAL_VALUES}
              layout='vertical'
              onFinish={handleSubmitForm}
              className='flex flex-col border border-neutral-300 rounded p-4'
            >
              <Form.Item<FormType>
                name='name'
                label='Họ và tên'
                rules={[
                  {
                    required: true,
                    type: 'string',
                    transform: (value) => value.trim(),
                    message: 'Vui lòng nhập họ và tên'
                  }
                ]}
              >
                <Input placeholder='Họ và tên' />
              </Form.Item>

              <Form.Item<FormType>
                name='birthday'
                label='Ngày sinh'
                rules={[
                  {
                    required: true,
                    type: 'object',
                    message: 'Vui lòng nhập ngày sinh'
                  }
                ]}
              >
                <DatePicker placeholder='Ngày sinh' format={'DD/MM/YYYY'} className='w-full' />
              </Form.Item>

              <Form.Item<FormType>
                name='email'
                label='Email'
                rules={[
                  { required: true, transform: (value) => value.trim(), message: 'Vui lòng nhập email' },
                  {
                    type: 'email',
                    message: 'Vui lòng nhập đúng email'
                  }
                ]}
              >
                <Input placeholder='Email' />
              </Form.Item>

              <Form.Item<FormType>
                name='phone'
                label='Số điện thoại'
                rules={[
                  {
                    required: true,
                    type: 'string',
                    transform: (value) => value.trim(),
                    message: 'Vui lòng nhập số điện thoại'
                  }
                ]}
              >
                <Input placeholder='Số điện thoại' />
              </Form.Item>

              <Form.Item<FormType>
                name='address'
                label='Địa chỉ hiện tại'
                rules={[
                  {
                    required: true,
                    type: 'string',
                    transform: (value) => value.trim(),
                    message: 'Vui lòng nhập địa chỉ hiện tại'
                  }
                ]}
              >
                <Input placeholder='Địa chỉ hiện tại' />
              </Form.Item>

              <Form.Item<FormType>
                label='Tệp CV (định dạng .pdf)'
                name='resume'
                valuePropName='file'
                getValueFromEvent={(e: any) => {
                  return e?.file
                }}
                rules={[
                  {
                    required: true,
                    type: 'object',
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject('Vui lòng chọn tệp CV')
                      }
                      const fileType = value.type
                      const fileSize = value.size
                      if (!['application/pdf'].includes(fileType)) {
                        return Promise.reject('Vui lòng nhập tệp có định dạng pdf')
                      }
                      if (fileSize / 1024 / 1024 > 2) {
                        return Promise.reject('Vui lòng nhập tệp có kích thước tối đa 2MB')
                      }
                      setResumeFile(value)
                      return Promise.resolve()
                    }
                  }
                ]}
                className='col-span-2'
              >
                <Upload
                  className='w-full'
                  showUploadList={false}
                  maxCount={1}
                  accept='application/pdf'
                  beforeUpload={() => false}
                >
                  {resumeFile ? (
                    <Button icon={<LinkOutlined />} className='w-full text-left'>
                      {resumeFile.name}
                    </Button>
                  ) : (
                    <Button icon={<UploadOutlined />} className='w-full text-left'>
                      Tải tệp CV
                    </Button>
                  )}
                </Upload>
              </Form.Item>

              <Form.Item>
                <p className='italic font-medium'>
                  Lưu ý: Bằng cách sử dụng biểu mẫu này, bạn đồng ý với việc lưu trữ và xử lý dữ liệu của bạn bởi
                  website này.
                </p>
              </Form.Item>

              <Form.Item<FormType> className='text-right mb-0'>
                <Button
                  type='primary'
                  loading={postApplicationMutation.isPending || postUploadFilesCvMutation.isPending}
                  onClick={form.submit}
                >
                  Hoàn thành
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecruitmentDetailPage

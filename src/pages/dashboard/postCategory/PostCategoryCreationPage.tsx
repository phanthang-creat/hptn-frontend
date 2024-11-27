/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Form, Input, Spin, Upload, UploadFile, UploadProps, notification } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { generateSlug } from '~/utils'
import { BASE_URLS } from '~/configs'
import {
  usePostPostCategoryMutation,
  usePatchPostCategoryByIdMutation,
  useGetPostCategoryByIdQuery
} from '~/stores/server/postCategoryStore'
import { usePostUploadFilesMutation } from '~/stores/server/fileUploadStore'
import { PostPostCategoryRequestBodyType } from '~/types/postCategoryType'

interface FormType {
  name: string
  slug: string
  description: string
}

const FORM_INITIAL_VALUES = {
  name: '',
  slug: '',
  description: ''
}

const PostCategoryCreationPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form] = Form.useForm<FormType>()
  const [notificationApi, notificationContextHolder] = notification.useNotification()

  // Stores
  const getPostCategoryByIdQuery = useGetPostCategoryByIdQuery({
    id
  })
  const postPostCategoryMutation = usePostPostCategoryMutation()
  const patchPostCategoryByIdMutation = usePatchPostCategoryByIdMutation()
  const postUploadFilesMutation = usePostUploadFilesMutation()

  // States
  const [fileList, setFileList] = useState<UploadFile[]>([])

  //   Methods
  const handleUploadFile = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('files', file)
      const uploadFileResponse = await postUploadFilesMutation.mutateAsync(formData)
      return uploadFileResponse.data[0].path
    } catch (error) {
      notificationApi.error({
        message: 'Thao tác thất bại'
      })
      return null
    }
  }

  const handleSubmit = async () => {
    try {
      const uploadImageUrls = await Promise.all(
        fileList.map((file) =>
          file.originFileObj ? handleUploadFile(file.originFileObj as File) : Promise.resolve(file.name)
        )
      )

      const formValues = form.getFieldsValue()
      const requestBody: PostPostCategoryRequestBodyType = {
        name: formValues.name.trim(),
        slug: generateSlug(formValues.name),
        description: formValues.description.trim(),
        image: BASE_URLS.uploadEndPoint,
        parentId: null,
        order: 1,
        enabled: true,
        images: (uploadImageUrls as Array<string>).map((uploadImageUrl) => ({
          image: uploadImageUrl
        }))
      }

      id
        ? await patchPostCategoryByIdMutation.mutateAsync({
            id: id,
            requestBody
          })
        : await postPostCategoryMutation.mutateAsync(requestBody)

      return navigate('/dashboard/post-category')
    } catch (error) {
      return notificationApi.error({
        message: 'Thao tác thất bại'
      })
    }
  }

  const handleChangeFileUpload: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList)

  //   Effects
  useEffect(() => {
    if (!getPostCategoryByIdQuery.data) {
      return
    }

    form.setFieldsValue({
      name: getPostCategoryByIdQuery.data.name,
      slug: getPostCategoryByIdQuery.data.slug,
      description: getPostCategoryByIdQuery.data.description
    })
    setFileList(
      getPostCategoryByIdQuery.data.images.map((image) => ({
        uid: image.id,
        name: image.image,
        status: 'done',
        url: BASE_URLS.uploadEndPoint + image.image
      }))
    )
  }, [getPostCategoryByIdQuery.data])

  return (
    <div className='flex flex-col items-start'>
      {notificationContextHolder}

      <h1 className='text-xl font-medium mb-4'>{id ? 'Chỉnh sửa danh mục bài viết' : 'Thêm mới danh mục bài viết'}</h1>

      {((id && getPostCategoryByIdQuery.isSuccess) || !id) && (
        <Form
          form={form}
          initialValues={FORM_INITIAL_VALUES}
          layout='vertical'
          onFinish={handleSubmit}
          className='w-full grid grid-cols-2 grid-flow-row gap-x-4'
        >
          <Form.Item<FormType>
            name='name'
            label='Tên'
            rules={[
              {
                required: true,
                type: 'string',
                transform: (value) => value.trim(),
                message: 'Vui lòng nhập tên'
              }
            ]}
          >
            <Input placeholder='Tên' onChange={(e) => form.setFieldValue('slug', generateSlug(e.target.value))} />
          </Form.Item>

          <Form.Item<FormType> name='slug' label='Slug'>
            <Input placeholder='Slug' disabled />
          </Form.Item>

          <Form.Item<FormType> name='description' label='Mô tả' className='col-span-2'>
            <Input.TextArea placeholder='Mô tả' />
          </Form.Item>

          <Form.Item label='Hình ảnh' className='col-span-2'>
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
        </Form>
      )}

      {getPostCategoryByIdQuery.isFetching && (
        <Spin
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
          indicator={<LoadingOutlined spin />}
        />
      )}

      <Button
        type='primary'
        className='self-end'
        loading={
          postPostCategoryMutation.isPending ||
          postUploadFilesMutation.isPending ||
          patchPostCategoryByIdMutation.isPending
        }
        disabled={getPostCategoryByIdQuery.isFetching || getPostCategoryByIdQuery.isError}
        onClick={() => form.submit()}
      >
        Hoàn thành
      </Button>
    </div>
  )
}

export default PostCategoryCreationPage

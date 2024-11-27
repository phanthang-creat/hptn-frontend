/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Checkbox, Form, Input, Select, Upload, notification } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { generateSlug, handleBeforeUpload, handleChangeUploadImage } from '~/utils'
import { BASE_URLS } from '~/configs'
import { useGetPostByIdQuery, usePostPostMutation, usePatchPostMutation } from '~/stores/server/postStore'
import { useGetPostCategoryQuery } from '~/stores/server/postCategoryStore'
import { usePostUploadFilesMutation } from '~/stores/server/fileUploadStore'
import { PanoJoditEditor } from '~/components'
import { PostPostRequestBodyType } from '~/types/postType'

interface FormType {
  title: string
  slug: string
  description: string
  image: string | File | null
  enabled: boolean
  postCategoryId: string | null
}

const FORM_INITIAL_VALUES = {
  title: '',
  slug: '',
  description: '',
  image: null,
  enabled: true,
  postCategoryId: null
}

const PostCreationPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form] = Form.useForm<FormType>()
  const [notificationApi, notificationContextHolder] = notification.useNotification()

  // Stores
  const getPostCategoryQuery = useGetPostCategoryQuery()
  const postUploadFilesMutation = usePostUploadFilesMutation()
  const getPostByIdQuery = useGetPostByIdQuery({
    id: id ?? ''
  })
  const postPostMutation = usePostPostMutation()
  const patchPostMutation = usePatchPostMutation()

  // States
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [content, setContent] = useState<string>('')
  const [shortContent, setShortContent] = useState<string>('')

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
      const formValues = form.getFieldsValue()

      const dataImageUrl =
        formValues.image instanceof File ? await handleUploadFile(formValues.image) : formValues.image
      if (!dataImageUrl) {
        return
      }

      const requestBody: PostPostRequestBodyType = {
        title: formValues.title.trim(),
        slug: generateSlug(formValues.title.trim()),
        content,
        description: formValues.description.trim(),
        image: dataImageUrl,
        enabled: formValues.enabled,
        postCategoryId: formValues.postCategoryId as string,
        shortContent
      }

      id
        ? await patchPostMutation.mutateAsync({
            id,
            requestBody
          })
        : await postPostMutation.mutateAsync(requestBody)

      notificationApi.success({
        message: 'Thao tác thành công'
      })

      return navigate('/dashboard/post')
    } catch (error) {
      return notificationApi.error({
        message: 'Thao tác thất bại'
      })
    }
  }

  //   Effects
  useEffect(() => {
    if (!getPostByIdQuery.data) {
      return
    }

    form.setFieldsValue({
      title: getPostByIdQuery.data.title,
      slug: getPostByIdQuery.data.slug,
      description: getPostByIdQuery.data.description,
      image: getPostByIdQuery.data.image,
      enabled: getPostByIdQuery.data.enabled,
      postCategoryId: getPostByIdQuery.data.postCategoryId
    })

    setImageUrl(BASE_URLS.uploadEndPoint + getPostByIdQuery.data.image)
    setContent(getPostByIdQuery.data.content)
    setShortContent(getPostByIdQuery.data.shortContent)
  }, [getPostByIdQuery.data, form])

  return (
    <div className='flex flex-col items-start'>
      {notificationContextHolder}

      <h1 className='text-xl font-medium mb-4'>{id ? 'Chỉnh sửa bài viết' : 'Thêm mới bài viết'}</h1>

      <Form
        form={form}
        initialValues={FORM_INITIAL_VALUES}
        layout='vertical'
        onFinish={handleSubmit}
        className='grid grid-cols-2 grid-flow-row gap-x-4'
      >
        <Form.Item<FormType>
          label='Ảnh'
          name='image'
          valuePropName='file'
          getValueFromEvent={(e: any) => {
            return e?.file
          }}
          rules={[{ required: true, message: 'Vui lòng chọn ảnh' }]}
          className='col-span-2'
        >
          <Upload
            listType='picture-card'
            showUploadList={false}
            beforeUpload={handleBeforeUpload}
            onChange={(info) =>
              handleChangeUploadImage(info, notificationApi, () => {
                setImageUrl(window.URL.createObjectURL(info.file as unknown as File))
              })
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

        <Form.Item<FormType>
          name='title'
          label='Tiêu đề'
          rules={[
            { required: true, type: 'string', transform: (value) => value.trim(), message: 'Vui lòng nhập tiêu đề' }
          ]}
        >
          <Input placeholder='Tiêu đề' onChange={(e) => form.setFieldValue('slug', generateSlug(e.target.value))} />
        </Form.Item>

        <Form.Item<FormType> name='slug' label='Slug'>
          <Input placeholder='Slug' disabled />
        </Form.Item>

        <Form.Item<FormType>
          name='postCategoryId'
          label='Danh mục bài viết'
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn danh mục vài viết'
            }
          ]}
        >
          <Select
            showSearch
            placeholder='Danh mục bài viết'
            options={getPostCategoryQuery.data?.map((item) => ({
              value: item.id,
              label: item.name
            }))}
            filterOption={(input: string, option?: { label: string; value: string }) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item<FormType> name='description' label='Mô tả'>
          <Input.TextArea placeholder='Mô tả' />
        </Form.Item>

        <Form.Item<FormType> label='Nội dung' className='col-span-2'>
          <PanoJoditEditor content={content} onChange={setContent} />
        </Form.Item>

        <Form.Item<FormType> label='Nội dung ngắn' className='col-span-2'>
          <PanoJoditEditor content={shortContent} onChange={setShortContent} />
        </Form.Item>

        <Form.Item<FormType> name='enabled' valuePropName='checked'>
          <Checkbox>Kích hoạt</Checkbox>
        </Form.Item>
      </Form>

      <Button
        type='primary'
        className='self-end'
        loading={postPostMutation.isPending || postUploadFilesMutation.isPending || patchPostMutation.isPending}
        onClick={() => form.submit()}
      >
        Hoàn thành
      </Button>
    </div>
  )
}

export default PostCreationPage

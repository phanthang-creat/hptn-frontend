/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Checkbox, Form, Input, Select, Upload, notification } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { generateSlug, handleBeforeUpload, handleChangeUploadImage } from '~/utils'
import { BASE_URLS } from '~/configs'
import {
  useGetRecruitmentByIdQuery,
  usePostRecruitmentMutation,
  usePatchRecruitmentMutation
} from '~/stores/server/recruitmentStore'
import { useGetRecruitmentPositionQuery } from '~/stores/server/recruitmentPositionStore'
import { useGetRecruitmentTypeQuery } from '~/stores/server/recruitmentTypeStore'
import { usePostUploadFilesMutation } from '~/stores/server/fileUploadStore'
import { PanoJoditEditor } from '~/components'
import { PostRecruitmentRequestBodyType } from '~/types/recruitmentType'

interface FormType {
  title: string
  slug: string
  description: string
  image: string | File | null
  enabled: boolean
  typeId: string | null
  positionId: string | null
  address: string
}

const FORM_INITIAL_VALUES = {
  title: '',
  slug: '',
  description: '',
  image: null,
  enabled: true,
  typeId: null,
  positionId: null,
  address: ''
}

const RecruitmentPostCreationPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form] = Form.useForm<FormType>()
  const [notificationApi, notificationContextHolder] = notification.useNotification()

  // Stores
  const getRecruitmentPositionQuery = useGetRecruitmentPositionQuery()
  const getRecruitmentTypeQuery = useGetRecruitmentTypeQuery()
  const postUploadFilesMutation = usePostUploadFilesMutation()
  const getRecruitmentByIdQuery = useGetRecruitmentByIdQuery({
    id
  })
  const postRecruitmentMutation = usePostRecruitmentMutation()
  const patchRecruitmentMutation = usePatchRecruitmentMutation()

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

  const handleSubmitPage = async () => {
    try {
      const formValues = form.getFieldsValue()

      const dataImageUrl =
        formValues.image instanceof File ? await handleUploadFile(formValues.image) : formValues.image
      if (!dataImageUrl) {
        return
      }

      const requestBody: PostRecruitmentRequestBodyType = {
        title: formValues.title.trim(),
        slug: generateSlug(formValues.title.trim()),
        content,
        description: formValues.description.trim(),
        image: dataImageUrl,
        enabled: formValues.enabled,
        shortContent,
        address: formValues.address.trim(),
        positionId: getRecruitmentPositionQuery.data?.find((item) => item.id.toString() === formValues.positionId)
          ?.id as number,
        typeId: getRecruitmentTypeQuery.data?.find((item) => item.id.toString() === formValues.typeId)?.id as number
      }

      id
        ? await patchRecruitmentMutation.mutateAsync({
            id,
            requestBody
          })
        : await postRecruitmentMutation.mutateAsync(requestBody)

      notificationApi.success({
        message: 'Thao tác thành công'
      })

      return navigate('/dashboard/recruitment-post')
    } catch (error) {
      return notificationApi.error({
        message: 'Thao tác thất bại'
      })
    }
  }

  //   Effects
  useEffect(() => {
    if (!getRecruitmentByIdQuery.data) {
      return
    }

    form.setFieldsValue({
      title: getRecruitmentByIdQuery.data.title,
      slug: getRecruitmentByIdQuery.data.slug,
      description: getRecruitmentByIdQuery.data.description,
      image: getRecruitmentByIdQuery.data.image,
      enabled: getRecruitmentByIdQuery.data.enabled,
      positionId: getRecruitmentByIdQuery.data.positionId.toString(),
      typeId: getRecruitmentByIdQuery.data.typeId.toString(),
      address: getRecruitmentByIdQuery.data.address
    })

    setImageUrl(BASE_URLS.uploadEndPoint + getRecruitmentByIdQuery.data.image)
    setContent(getRecruitmentByIdQuery.data.content)
    setShortContent(getRecruitmentByIdQuery.data.shortContent)
  }, [getRecruitmentByIdQuery.data])

  return getRecruitmentPositionQuery.data &&
    getRecruitmentTypeQuery.data &&
    (!id || (id && getRecruitmentByIdQuery.data)) ? (
    <div className='flex flex-col items-start'>
      {notificationContextHolder}

      <Form
        form={form}
        initialValues={FORM_INITIAL_VALUES}
        layout='vertical'
        onFinish={handleSubmitPage}
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
          <Input placeholder='Tên' onChange={(e) => form.setFieldValue('slug', generateSlug(e.target.value))} />
        </Form.Item>

        <Form.Item<FormType> name='slug' label='Slug'>
          <Input placeholder='Slug' disabled />
        </Form.Item>

        <Form.Item<FormType>
          name='positionId'
          label='Vị trí tuyển dụng'
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn vị trí tuyển dụng'
            }
          ]}
        >
          <Select
            showSearch
            placeholder='Vị trí tuyển dụng'
            options={getRecruitmentPositionQuery.data?.map((item) => ({
              value: item.id.toString(),
              label: item.name
            }))}
            filterOption={(input: string, option?: { label: string; value: string }) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item<FormType>
          name='typeId'
          label='Loại tuyển dụng'
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn loại tuyển dụng'
            }
          ]}
        >
          <Select
            showSearch
            placeholder='Loại tuyển dụng'
            options={getRecruitmentTypeQuery.data?.map((item) => ({
              value: item.id.toString(),
              label: item.name
            }))}
            filterOption={(input: string, option?: { label: string; value: string }) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item<FormType> name='address' label='Địa chỉ'>
          <Input.TextArea placeholder='Địa chỉ' />
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
        loading={postRecruitmentMutation.isPending || postUploadFilesMutation.isPending}
        onClick={() => form.submit()}
      >
        Hoàn thành
      </Button>
    </div>
  ) : null
}

export default RecruitmentPostCreationPage

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Checkbox, Form, Input, InputNumber, Select, Upload, UploadFile, UploadProps, notification } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { generateSlug, handleBeforeUpload, handleChangeUploadImage } from '~/utils'
import { BASE_URLS } from '~/configs'
import { PanoJoditEditor } from '~/components'
import { useGetProductByIdQuery, usePostProductMutation, usePatchProductMutation } from '~/stores/server/productStore'
import { useGetProductCategoryQuery } from '~/stores/server/productCategoryStore'
import { usePostUploadFilesMutation } from '~/stores/server/fileUploadStore'
import { PostProductRequestBodyType } from '~/types/productType'

interface FormType {
  name: string
  slug: string
  description: string
  image: string | File | null
  enabled: boolean
  categoryId: string | null
  price: string
}

const FORM_INITIAL_VALUES: FormType = {
  name: '',
  slug: '',
  description: '',
  image: null,
  enabled: true,
  categoryId: null,
  price: ''
}

const ProductCreationPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form] = Form.useForm<FormType>()
  const [notificationApi, notificationContextHolder] = notification.useNotification()

  // Stores
  const getProductCategoryQuery = useGetProductCategoryQuery()
  const postUploadFilesMutation = usePostUploadFilesMutation()
  const getProductByIdQuery = useGetProductByIdQuery({
    id
  })
  const postProductMutation = usePostProductMutation()
  const patchProductMutation = usePatchProductMutation()

  // States
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [content, setContent] = useState<string>('')
  const [shortContent, setShortContent] = useState<string>('')
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
      const formValues = form.getFieldsValue()

      const dataImageUrl =
        formValues.image instanceof File ? await handleUploadFile(formValues.image) : formValues.image
      if (!dataImageUrl) {
        return
      }

      const uploadImageUrls = await Promise.all(
        fileList.map((file) =>
          file.originFileObj ? handleUploadFile(file.originFileObj as File) : Promise.resolve(file.name)
        )
      )

      const requestBody: PostProductRequestBodyType = {
        name: formValues.name.trim(),
        slug: generateSlug(formValues.name.trim()),
        content,
        description: formValues.description.trim(),
        image: dataImageUrl,
        enabled: formValues.enabled,
        categoryId: formValues.categoryId as string,
        shortContent,
        price: formValues.price,
        quantity: 1,
        images: (uploadImageUrls as Array<string>).map((uploadImageUrl) => ({
          image: uploadImageUrl
        }))
      }

      id
        ? await patchProductMutation.mutateAsync({
            id,
            requestBody
          })
        : await postProductMutation.mutateAsync(requestBody)

      notificationApi.success({
        message: 'Thao tác thành công'
      })

      return navigate('/dashboard/product')
    } catch (error) {
      return notificationApi.error({
        message: 'Thao tác thất bại'
      })
    }
  }

  const handleChangeFileUpload: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList)

  //   Effects
  useEffect(() => {
    if (!getProductByIdQuery.data) {
      return
    }

    form.setFieldsValue({
      name: getProductByIdQuery.data.name,
      slug: getProductByIdQuery.data.slug,
      description: getProductByIdQuery.data.description,
      image: getProductByIdQuery.data.image,
      enabled: getProductByIdQuery.data.enabled,
      categoryId: getProductByIdQuery.data.categoryId,
      price: getProductByIdQuery.data.price.toString()
    })

    setImageUrl(BASE_URLS.uploadEndPoint + getProductByIdQuery.data.image)
    setContent(getProductByIdQuery.data.content)
    setShortContent(getProductByIdQuery.data.shortContent)
    setFileList(
      getProductByIdQuery.data.images.map((image) => ({
        uid: image.id,
        name: image.image,
        status: 'done',
        url: BASE_URLS.uploadEndPoint + image.image
      }))
    )
  }, [getProductByIdQuery.data, form])

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
          name='name'
          label='Tên'
          rules={[{ required: true, type: 'string', transform: (value) => value.trim(), message: 'Vui lòng nhập tên' }]}
        >
          <Input placeholder='Tên' onChange={(e) => form.setFieldValue('slug', generateSlug(e.target.value))} />
        </Form.Item>

        <Form.Item<FormType> name='slug' label='Slug'>
          <Input placeholder='Slug' disabled />
        </Form.Item>

        <Form.Item<FormType>
          name='categoryId'
          label='Danh mục sản phẩm'
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn danh mục vài viết'
            }
          ]}
        >
          <Select
            showSearch
            placeholder='Danh mục sản phẩm'
            options={getProductCategoryQuery.data?.map((item) => ({
              value: item.id,
              label: item.name
            }))}
            filterOption={(input: string, option?: { label: string; value: string }) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item<FormType>
          name='price'
          label='Giá'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập giá'
            }
          ]}
        >
          <InputNumber
            placeholder='Giá'
            className='w-full'
            formatter={(value: string | number | undefined) =>
              value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
            }
            parser={(displayValue: string | undefined) =>
              displayValue ? displayValue.toString().replace(/\$\s?|(,*)/g, '') : ''
            }
          />
        </Form.Item>

        <Form.Item<FormType> name='description' label='Mô tả'>
          <Input.TextArea placeholder='Mô tả' />
        </Form.Item>

        <Form.Item label='Danh sách hình ảnh'>
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
        loading={postProductMutation.isPending || postUploadFilesMutation.isPending || patchProductMutation.isPending}
        onClick={() => form.submit()}
      >
        Hoàn thành
      </Button>
    </div>
  )
}

export default ProductCreationPage

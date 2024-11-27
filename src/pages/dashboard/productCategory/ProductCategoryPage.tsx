/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react'
import { Button, Form, Input, Modal, Table, Upload, notification } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { generateSlug, handleBeforeUpload, handleChangeUploadImage } from '~/utils'
import {
  useGetProductCategoryQuery,
  usePostProductCategoryMutation,
  usePatchProductCategoryByIdMutation,
  useDeleteProductCategoryByIdMutation
} from '~/stores/server/productCategoryStore'
import { usePostUploadFilesMutation } from '~/stores/server/fileUploadStore'
import { BASE_URLS } from '~/configs'
import { GetProductCategoryResponseDataType, PostProductCategoryRequestBodyType } from '~/types/productCategoryType'

interface FormType {
  name: string
  slug: string
  image: File | string | null
  description: string
}

const FORM_INITIAL_VALUES = {
  name: '',
  slug: '',
  image: null,
  description: ''
}

const ProductCategoryPage = () => {
  const [form] = Form.useForm<FormType>()
  const [notificationApi, notificationContextHolder] = notification.useNotification()

  // Stores
  const getProductCategoryQuery = useGetProductCategoryQuery()
  const postProductCategoryMutation = usePostProductCategoryMutation()
  const patchProductCategoryByIdMutation = usePatchProductCategoryByIdMutation()
  const deleteProductCategoryByIdMutation = useDeleteProductCategoryByIdMutation()
  const postUploadFilesMutation = usePostUploadFilesMutation()

  // States
  const [isOpenCreatingModal, setIsOpenCreatingModal] = useState<boolean>(false)
  const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] = useState<boolean>(false)
  const [selectedPostCategoryId, setSelectedPostCategoryId] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  // Constants
  const columns: ColumnsType<GetProductCategoryResponseDataType> = [
    {
      key: 'index',
      dataIndex: 'index',
      title: 'STT',
      width: '10%',
      align: 'center'
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Tên',
      width: '35%'
    },
    {
      key: 'image',
      dataIndex: 'image',
      title: 'Ảnh',
      width: '10%',
      render: (text) => {
        return (
          <div>
            {text ? <img src={BASE_URLS.uploadEndPoint + text} alt='' className='w-8 h-8 object-contain' /> : '--'}
          </div>
        )
      }
    },
    {
      key: 'slug',
      dataIndex: 'slug',
      title: 'Slug',
      width: '30%'
    },
    {
      key: 'action',
      dataIndex: 'action',
      title: 'Hành động',
      width: '15%',
      align: 'center',
      render: (_, record) => (
        <div className='flex items-center justify-center gap-2'>
          <Button
            shape='circle'
            icon={<EditOutlined />}
            onClick={() => {
              form.setFieldsValue(record)
              setImageUrl(BASE_URLS.uploadEndPoint + record.image)
              setSelectedPostCategoryId(record.id)
              setIsOpenCreatingModal(true)
            }}
          />
          <Button
            shape='circle'
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedPostCategoryId(record.id)
              setIsOpenConfirmDeleteModal(true)
            }}
          />
        </div>
      )
    }
  ]

  // Methods
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

      const requestBody: PostProductCategoryRequestBodyType = {
        name: formValues.name.trim(),
        slug: generateSlug(formValues.name),
        description: formValues.description.trim(),
        image: dataImageUrl,
        parentId: null,
        order: 1,
        enabled: true
      }

      selectedPostCategoryId
        ? await patchProductCategoryByIdMutation.mutateAsync({
            id: selectedPostCategoryId,
            requestBody
          })
        : await postProductCategoryMutation.mutateAsync(requestBody)

      handleCancelCreating()
      return notificationApi.success({
        message: 'Thao tác thành công'
      })
    } catch (error) {
      return notificationApi.error({
        message: 'Thao tác thất bại'
      })
    }
  }

  const handleDelete = async () => {
    try {
      if (!selectedPostCategoryId) {
        return
      }
      await deleteProductCategoryByIdMutation.mutateAsync(selectedPostCategoryId)
      handleCancelDeleting()
      return notificationApi.success({
        message: 'Thao tác thành công'
      })
    } catch (error) {
      return notificationApi.error({
        message: 'Thao tác thất bại'
      })
    }
  }

  const handleCancelCreating = () => {
    form.resetFields()
    selectedPostCategoryId && setSelectedPostCategoryId(null)
    setIsOpenCreatingModal(false)
    if (imageUrl && !imageUrl.startsWith(BASE_URLS.uploadEndPoint)) {
      window.URL.revokeObjectURL(imageUrl)
    }
    setImageUrl(null)
  }

  const handleCancelDeleting = () => {
    setSelectedPostCategoryId(null)
    setIsOpenConfirmDeleteModal(false)
  }

  // Memos
  const tableData = useMemo(
    () =>
      Array.isArray(getProductCategoryQuery.data)
        ? getProductCategoryQuery.data.map((item, index) => ({ ...item, index: index + 1, key: item.id }))
        : [],
    [getProductCategoryQuery.data]
  )

  // Template
  return (
    <div>
      {notificationContextHolder}

      <h1 className='text-xl font-medium'>Quản lý danh mục bài viết</h1>

      <div className='flex flex-col items-start gap-4'>
        <Button type='primary' className='self-end' onClick={() => setIsOpenCreatingModal(true)}>
          Thêm mới
        </Button>

        {/* Table */}
        <Table
          className='w-full'
          columns={columns}
          dataSource={tableData}
          bordered
          pagination={{
            total: tableData.length,
            defaultPageSize: 5,
            pageSizeOptions: [5, 10, 20],
            showSizeChanger: true
          }}
          loading={getProductCategoryQuery.isLoading}
        />
      </div>

      {/* Create/Update modal */}
      <Modal
        title={selectedPostCategoryId ? 'Chỉnh sửa thông tin' : 'Thêm mới thông tin'}
        open={isOpenCreatingModal}
        maskClosable={false}
        width={1000}
        okText='Hoàn thành'
        cancelText='Hủy'
        onOk={() => form.submit()}
        confirmLoading={
          postProductCategoryMutation.isPending ||
          patchProductCategoryByIdMutation.isPending ||
          postUploadFilesMutation.isPending
        }
        onCancel={handleCancelCreating}
      >
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
            rules={[
              { required: true, type: 'string', transform: (value) => value.trim(), message: 'Vui lòng nhập tên' }
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
        </Form>
      </Modal>

      {/* Delete modal */}
      <Modal
        title={'Xóa thông tin'}
        open={isOpenConfirmDeleteModal}
        maskClosable={false}
        okText='Hoàn thành'
        cancelText='Hủy'
        onOk={handleDelete}
        confirmLoading={deleteProductCategoryByIdMutation.isPending}
        onCancel={handleCancelDeleting}
      >
        <div>Hành động này không thể khôi phục. Bạn chắc chắn muốn xóa thông tin này?</div>
      </Modal>
    </div>
  )
}

export default ProductCategoryPage

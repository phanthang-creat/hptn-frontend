/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useMemo, useState } from 'react'
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Switch, Table, Upload } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { NotificationInstance } from 'antd/es/notification/interface'
import { v4 as uuidv4 } from 'uuid'
import BASE_URLS from '~/configs/baseUrl'
import { ChessKnowledgePageConfigDataType, ChessKnowledgeSectionType } from '~/types/chessKnowledgePageType'
import { GetPostCategoryItemResponseDataType } from '~/types/postCategoryType'
import { handleBeforeUpload, handleChangeUploadImage } from '~/utils'

interface Props {
  pageConfigData: ChessKnowledgePageConfigDataType | null
  postCategoryData: GetPostCategoryItemResponseDataType[]
  loading: boolean
  notificationApi: NotificationInstance
  onUpdatePageConfig: (config: string) => Promise<void>
  onUploadFile: (file: File) => Promise<string | null>
}

interface FormFieldType {
  image: File | null | string
  title: string
  subTitle: string
  order: number
  enabled: boolean
  postCategoryId: string | null
}

const FORM_INITIAL_VALUES: FormFieldType = {
  image: null,
  title: '',
  subTitle: '',
  order: 1,
  enabled: true,
  postCategoryId: null
}

const ChessKnowledge: FC<Props> = ({
  pageConfigData,
  postCategoryData,
  loading,
  notificationApi,
  onUpdatePageConfig,
  onUploadFile
}) => {
  const [form] = Form.useForm<FormFieldType>()

  // States
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] = useState<boolean>(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  // Constants
  const columns: ColumnsType<ChessKnowledgeSectionType> = [
    {
      key: 'index',
      dataIndex: 'index',
      title: 'STT',
      width: '10%',
      align: 'center'
    },
    {
      key: 'image',
      dataIndex: 'image',
      title: 'Ảnh',
      width: '20%',
      render: (text) => {
        return (
          <div>
            {text ? <img src={BASE_URLS.uploadEndPoint + text} alt='' className='w-8 h-8 object-contain' /> : '--'}
          </div>
        )
      }
    },
    {
      key: 'title',
      dataIndex: 'title',
      title: 'Tiêu đề',
      width: '15%'
    },
    {
      key: 'link',
      dataIndex: 'link',
      title: 'Đường dẫn',
      width: '15%',
      render: (text) => <span>{text ? text : '--'}</span>
    },
    {
      key: 'order',
      dataIndex: 'order',
      title: 'Thứ tự',
      width: '10%',
      align: 'center'
    },
    {
      key: 'enabled',
      dataIndex: 'enabled',
      title: 'Kích hoạt',
      width: '15%',
      align: 'center',
      render: (_, record) => {
        return <Switch checked={record.enabled} disabled />
      }
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
              form.setFieldsValue({
                ...record,
                postCategoryId: postCategoryData.find((item) => item.slug === record.postCategorySlug)?.id as string
              })
              setSelectedItemId(record.id)
              setImageUrl(record.image ? BASE_URLS.uploadEndPoint + record.image : null)
              setIsOpenModal(true)
            }}
          />
          <Button
            shape='circle'
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedItemId(record.id)
              setIsOpenConfirmDeleteModal(true)
            }}
          />
        </div>
      )
    }
  ]

  // Methods
  const resetCreatingStates = () => {
    setIsOpenModal(false)
    selectedItemId && setSelectedItemId(null)
    if (imageUrl && !imageUrl.startsWith(BASE_URLS.uploadEndPoint)) {
      window.URL.revokeObjectURL(imageUrl)
    }
    imageUrl && setImageUrl(null)
    form.resetFields()
  }

  const resetDeletingStates = () => {
    setIsOpenConfirmDeleteModal(false)
    setSelectedItemId(null)
  }

  const handleSubmit = async () => {
    const formValues = form.getFieldsValue()

    const dataImageUrl = formValues.image instanceof File ? await onUploadFile(formValues.image) : formValues.image
    if (!dataImageUrl) {
      return
    }

    const data: ChessKnowledgeSectionType = {
      id: uuidv4(),
      title: formValues.title.trim(),
      image: dataImageUrl,
      subTitle: formValues.subTitle.trim(),
      postCategorySlug: postCategoryData.find((item) => item.id === formValues.postCategoryId)?.slug as string,
      order: formValues.order,
      enabled: formValues.enabled
    }

    // Handle update
    await onUpdatePageConfig(
      JSON.stringify(
        pageConfigData
          ? {
              ...pageConfigData,
              chessKnowledge: Array.isArray(pageConfigData.chessKnowledge)
                ? selectedItemId
                  ? pageConfigData.chessKnowledge.map((item) =>
                      item.id === selectedItemId ? { ...data, id: item.id } : item
                    )
                  : [...pageConfigData.chessKnowledge, data]
                : [data]
            }
          : {
              chessKnowledge: [data]
            }
      )
    )

    // Reset
    resetCreatingStates()
  }

  const handleDelete = async () => {
    if (!selectedItemId || !pageConfigData) {
      return
    }

    await onUpdatePageConfig(
      JSON.stringify({
        ...pageConfigData,
        chessKnowledge: Array.isArray(pageConfigData.chessKnowledge)
          ? pageConfigData.chessKnowledge.filter((item) => item.id !== selectedItemId)
          : []
      })
    )

    resetDeletingStates()
  }

  // Memo
  const tableData = useMemo(
    () =>
      Array.isArray(pageConfigData?.chessKnowledge)
        ? pageConfigData.chessKnowledge
            .sort((a, b) => a.order - b.order)
            .map((item, index) => ({ ...item, index: index + 1, key: item.id }))
        : [],
    [pageConfigData]
  )

  return (
    <div className='flex flex-col items-start gap-4'>
      <Button type='primary' className='self-end' onClick={() => setIsOpenModal(true)}>
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
        onChange={(pagination: TablePaginationConfig) => console.log(pagination)}
      />

      {/* Create/Update modal */}
      <Modal
        title={selectedItemId ? 'Chỉnh sửa thông tin' : 'Thêm mới thông tin'}
        open={isOpenModal}
        maskClosable={false}
        width={1000}
        okText='Hoàn thành'
        cancelText='Hủy'
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={resetCreatingStates}
      >
        <Form
          form={form}
          initialValues={FORM_INITIAL_VALUES}
          layout='vertical'
          onFinish={handleSubmit}
          className='grid grid-cols-2 grid-flow-row gap-x-4'
        >
          <Form.Item<FormFieldType>
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
                handleChangeUploadImage(info, notificationApi, () =>
                  setImageUrl(window.URL.createObjectURL(info.file as unknown as File))
                )
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

          <Form.Item<FormFieldType>
            name='title'
            label='Tiêu đề'
            rules={[
              { required: true, type: 'string', transform: (value) => value.trim(), message: 'Vui lòng nhập tiêu đề' }
            ]}
          >
            <Input placeholder='Tiêu đề' />
          </Form.Item>

          <Form.Item<FormFieldType>
            name='subTitle'
            label='Tiêu đề phụ'
            rules={[
              {
                required: true,
                type: 'string',
                transform: (value) => value.trim(),
                message: 'Vui lòng nhập tiêu đề phụ'
              }
            ]}
          >
            <Input placeholder='Tiêu đề phụ' />
          </Form.Item>

          <Form.Item<FormFieldType>
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
              options={postCategoryData.map((item) => ({
                value: item.id,
                label: item.name
              }))}
              filterOption={(input: string, option?: { label: string; value: string }) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item<FormFieldType>
            name='order'
            label='Thứ tự'
            rules={[{ required: true, type: 'number', message: 'Vui lòng nhập thứ tự' }]}
          >
            <InputNumber placeholder='Thứ tự' min={1} className='w-full' />
          </Form.Item>

          <Form.Item<FormFieldType> name='enabled' valuePropName='checked'>
            <Checkbox defaultChecked={true}>Kích hoạt</Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      {/* Confirm delete modal */}
      <Modal
        title={'Xóa thông tin'}
        open={isOpenConfirmDeleteModal}
        maskClosable={false}
        okText='Hoàn thành'
        cancelText='Hủy'
        onOk={handleDelete}
        confirmLoading={loading}
        onCancel={resetDeletingStates}
      >
        <div>Hành động này không thể khôi phục. Bạn chắc chắn muốn xóa thông tin này?</div>
      </Modal>
    </div>
  )
}

export default ChessKnowledge

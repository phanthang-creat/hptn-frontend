import { FC, useState, useMemo } from 'react'
import { Button, Checkbox, Form, Input, InputNumber, Modal, Switch, Table, Upload, notification } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { v4 as uuidv4 } from 'uuid'
import { PanoFooterSectionCode, PanoFooterSectionDataType } from '~/types/footerType'
import BASE_URLS from '~/configs/baseUrl'
import { handleBeforeUpload, handleChangeUploadImage } from '~/utils'
import { usePatchFootersMutation } from '~/stores/server/footerStore'
import { usePostUploadFilesMutation } from '~/stores/server/fileUploadStore'

interface Props {
  footerData?: PanoFooterSectionDataType[]
  code: PanoFooterSectionCode
  title: string
}

interface FormType {
  id?: string
  image: File | string | null
  label: string
  link: string
  order: number
  enabled: boolean
}

const FORM_INITIAL_VALUES = {
  image: null,
  label: '',
  link: '',
  order: 1,
  enabled: true
}

const CommonTab: FC<Props> = ({ footerData, code, title }) => {
  const [form] = Form.useForm<FormType>()
  const [notificationApi, notificationContextHolder] = notification.useNotification()

  // Stores
  const patchFootersMutation = usePatchFootersMutation()
  const postUploadFilesMutation = usePostUploadFilesMutation()

  const sectionData = Array.isArray(footerData) ? footerData.find((item) => item.code === code) : undefined

  // States
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] = useState<boolean>(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  // Constants
  const columns: ColumnsType<FormType> = [
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
      key: 'label',
      dataIndex: 'label',
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
              form.setFieldsValue(record)
              setSelectedItemId(record.id as string)
              setImageUrl(record.image ? BASE_URLS.uploadEndPoint + record.image : null)
              setIsOpenModal(true)
            }}
          />
          <Button
            shape='circle'
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedItemId(record.id as string)
              setIsOpenConfirmDeleteModal(true)
            }}
          />
        </div>
      )
    }
  ]

  const handleSubmit = async () => {
    const formValues = form.getFieldsValue()

    let imageUrl = formValues.image
    if (formValues.image instanceof File) {
      // Handle upload file
      const formData = new FormData()
      formData.append('files', formValues.image)
      const uploadFileResponse = await postUploadFilesMutation.mutateAsync(formData)
      imageUrl = uploadFileResponse.data[0].path
    }

    const tempFooterData = Array.isArray(footerData) ? [...footerData] : []
    const newItemData = {
      id: uuidv4(),
      image: imageUrl,
      label: formValues.label.trim(),
      link: formValues.link.trim(),
      order: formValues.order,
      enabled: formValues.enabled
    }

    const bodyData = sectionData
      ? tempFooterData.map((section) =>
          section.code === code
            ? {
                ...section,
                data: Array.isArray(section.data)
                  ? selectedItemId
                    ? section.data.map((item) => (item.id === selectedItemId ? { ...newItemData, id: item.id } : item))
                    : [...section.data, newItemData]
                  : [newItemData]
              }
            : section
        )
      : [
          ...tempFooterData,
          {
            code,
            title,
            data: [newItemData]
          }
        ]

    try {
      await patchFootersMutation.mutateAsync(JSON.stringify({ data: bodyData }))
      handleCancelCreating()
      return notificationApi.success({
        message: selectedItemId ? 'Chỉnh sửa thông tin thành công' : 'Thêm mới thông tin thành công'
      })
    } catch (error) {
      return notificationApi.error({
        message: selectedItemId ? 'Chỉnh sửa thông tin thất bại' : 'Thêm mới thông tin thất bại'
      })
    }
  }

  const handleDelete = async () => {
    try {
      const tempFooterData = Array.isArray(footerData) ? [...footerData] : []
      const bodyData = tempFooterData.map((section) =>
        section.code === 'FOLLOW_US'
          ? {
              code: section.code,
              data: Array.isArray(section.data) ? section.data.filter((item) => item.id !== selectedItemId) : []
            }
          : section
      )

      await patchFootersMutation.mutateAsync(JSON.stringify({ data: bodyData }))
      handleCancelDeleting()
      return notificationApi.success({
        message: 'Xóa thông tin thành công'
      })
    } catch (error) {
      return notificationApi.error({
        message: 'Xóa thông tin thất bại'
      })
    }
  }

  const handleCancelCreating = () => {
    selectedItemId && setSelectedItemId(null)
    setIsOpenModal(false)
    form.resetFields()
    if (imageUrl && !imageUrl.startsWith(BASE_URLS.uploadEndPoint)) {
      window.URL.revokeObjectURL(imageUrl)
    }
    setImageUrl(null)
  }

  const handleCancelDeleting = () => {
    setSelectedItemId(null)
    setIsOpenConfirmDeleteModal(false)
  }

  // Memo
  const tableData = useMemo(
    () =>
      Array.isArray(sectionData?.data)
        ? sectionData?.data
            .sort((a, b) => a.order - b.order)
            .map((item, index) => ({ ...item, index: index + 1, key: item.id }))
        : [],
    [sectionData]
  )

  return (
    <div className='flex flex-col items-start gap-4'>
      {notificationContextHolder}

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
        confirmLoading={patchFootersMutation.isPending || postUploadFilesMutation.isPending}
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            getValueFromEvent={(e: any) => {
              return e?.file
            }}
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
            name='label'
            label='Tiêu đề'
            rules={[
              { required: true, type: 'string', transform: (value) => value.trim(), message: 'Vui lòng nhập tiêu đề' }
            ]}
          >
            <Input placeholder='Tên' />
          </Form.Item>

          <Form.Item<FormType>
            name='link'
            label='Đường dẫn'
            rules={[
              { required: true, type: 'string', transform: (value) => value.trim(), message: 'Vui lòng nhập đường dẫn' }
            ]}
          >
            <Input placeholder='Đường dẫn' />
          </Form.Item>

          <Form.Item<FormType>
            name='order'
            label='Thứ tự'
            rules={[{ required: true, type: 'number', message: 'Vui lòng nhập thứ tự' }]}
          >
            <InputNumber placeholder='Thứ tự' min={1} className='w-full' />
          </Form.Item>

          <Form.Item<FormType> name='enabled' valuePropName='checked'>
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
        confirmLoading={patchFootersMutation.isPending}
        onCancel={handleCancelDeleting}
      >
        <div>Hành động này không thể khôi phục. Bạn chắc chắn muốn xóa thông tin này?</div>
      </Modal>
    </div>
  )
}

export default CommonTab

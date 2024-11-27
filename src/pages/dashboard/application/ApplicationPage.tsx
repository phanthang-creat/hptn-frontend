import { useMemo, useState } from 'react'
import { Button, Modal, Table, notification, Form, Input, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { GetApplicationQueryItemResponseDataType, PatchApplicationRequestBodyType } from '~/types/applicationType'
import {
  useDeleteApplicationByIdMutation,
  useGetApplicationQuery,
  usePatchApplicationMutation
} from '~/stores/server/applicationStore'
import { useGetApplicationStatusQuery } from '~/stores/server/applicationStatusStore'
import { BASE_URLS } from '~/configs'
import dayjs from 'dayjs'

interface FormFieldType extends PatchApplicationRequestBodyType {
  status: number
  recruitmentName: string
  dateOfBirthFormatted: string
}

const INITIAL_FORM_FIELD_VALUE: FormFieldType = {
  fullName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  address: '',
  cv: '',
  recruitmentId: '',
  description: '',
  status: 0,
  recruitmentName: '',
  dateOfBirthFormatted: ''
}

const ApplicationPage = () => {
  const [notificationApi, notificationContextHolder] = notification.useNotification()
  const [form] = Form.useForm<FormFieldType>()

  // Stores
  const getApplicationStatusQuery = useGetApplicationStatusQuery()
  const getApplicationQuery = useGetApplicationQuery({})
  const deleteApplicationByIdMutation = useDeleteApplicationByIdMutation()
  const patchApplicationMutation = usePatchApplicationMutation()

  // States
  const [isOpenCreatingModal, setIsOpenCreatingModal] = useState<boolean>(false)
  const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] = useState<boolean>(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  // Constants
  const columns: ColumnsType<GetApplicationQueryItemResponseDataType> = [
    {
      key: 'index',
      dataIndex: 'index',
      title: 'STT',
      width: '10%',
      align: 'center'
    },
    {
      key: 'fullName',
      dataIndex: 'fullName',
      title: 'Tên',
      width: '25%'
    },
    {
      key: 'email',
      dataIndex: 'email',
      title: 'Email',
      width: '10%'
    },
    {
      key: 'position',
      dataIndex: 'position',
      title: 'Vị trí',
      width: '25%',
      render: (_, record) => <div>{record.recruitment.position.name}</div>
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'Trạng thái',
      width: '15%',
      align: 'center',
      render: (_, record) => {
        return <div>{record.applicationStatus.name}</div>
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
              setSelectedItemId(record.id)
              form.setFieldsValue({
                fullName: record.fullName,
                email: record.email,
                phone: record.phone,
                dateOfBirth: record.dateOfBirth,
                dateOfBirthFormatted: dayjs(record.dateOfBirth).format('DD/MM/YYYY'),
                address: record.address,
                cv: record.cv,
                recruitmentId: record.recruitmentId,
                recruitmentName: record.recruitment.title,
                description: record.description,
                status: record.status
              })
              setIsOpenCreatingModal(true)
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
  const handleDownloadFile = async () => {
    const cvFilePath = form.getFieldValue('cv')
    if (!cvFilePath) {
      return
    }

    if (cvFilePath.includes('.pdf')) {
      window.open(BASE_URLS.uploadEndPoint + cvFilePath, '_blank')
    } else {
      const link = document.createElement('a')
      link.href = BASE_URLS.uploadEndPoint + cvFilePath
      document.body.appendChild(link)

      link.click()
      document.body.removeChild(link)
    }
  }

  const handleSubmit = async () => {
    try {
      const formFieldValues = form.getFieldsValue()

      const requestBody: PatchApplicationRequestBodyType = {
        fullName: formFieldValues.fullName,
        email: formFieldValues.email,
        phone: formFieldValues.phone,
        dateOfBirth: formFieldValues.dateOfBirth,
        address: formFieldValues.address,
        cv: formFieldValues.cv,
        recruitmentId: formFieldValues.recruitmentId,
        description: formFieldValues.description,
        status: formFieldValues.status
      }

      await patchApplicationMutation.mutateAsync({
        id: selectedItemId as string,
        requestBody
      })

      handleCancelUpdating()

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
      if (!selectedItemId) {
        return
      }
      await deleteApplicationByIdMutation.mutateAsync(selectedItemId)
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

  const handleCancelUpdating = () => {
    form.setFieldsValue(INITIAL_FORM_FIELD_VALUE)
    setIsOpenCreatingModal(false)
    setSelectedItemId(null)
  }

  const handleCancelDeleting = () => {
    setSelectedItemId(null)
    setIsOpenConfirmDeleteModal(false)
  }

  // Memos
  const tableData = useMemo(
    () =>
      Array.isArray(getApplicationQuery.data?.data)
        ? getApplicationQuery.data.data.map((item, index) => ({ ...item, index: index + 1, key: item.id }))
        : [],
    [getApplicationQuery.data]
  )

  // Template
  return (
    <div>
      {notificationContextHolder}

      <h1 className='text-xl font-medium'>Quản lý đơn tuyển dụng</h1>

      <div className='flex flex-col items-start gap-4'>
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
          loading={getApplicationQuery.isLoading}
        />
      </div>

      {/* Create/Update modal */}
      <Modal
        title={selectedItemId ? 'Chỉnh sửa thông tin' : 'Thêm mới thông tin'}
        open={isOpenCreatingModal}
        maskClosable={false}
        width={1000}
        okText='Hoàn thành'
        cancelText='Hủy'
        onOk={() => form.submit()}
        confirmLoading={patchApplicationMutation.isPending}
        onCancel={handleCancelUpdating}
      >
        <Form
          form={form}
          initialValues={INITIAL_FORM_FIELD_VALUE}
          layout='vertical'
          onFinish={handleSubmit}
          className='grid grid-cols-2 grid-flow-row gap-x-4 max-h-96 overflow-auto'
        >
          <Form.Item<FormFieldType> name='fullName' label='Tên'>
            <Input placeholder='Tên' readOnly />
          </Form.Item>

          <Form.Item<FormFieldType> name='email' label='Email'>
            <Input placeholder='Email' readOnly />
          </Form.Item>

          <Form.Item<FormFieldType> name='phone' label='Số điện thoại'>
            <Input placeholder='Số điện thoại' readOnly />
          </Form.Item>

          <Form.Item<FormFieldType> name='dateOfBirthFormatted' label='Ngày sinh'>
            <Input placeholder='Ngày sinh' readOnly />
          </Form.Item>

          <Form.Item<FormFieldType> name='address' label='Địa chỉ'>
            <Input placeholder='Địa chỉ' readOnly />
          </Form.Item>

          <Form.Item<FormFieldType> name='cv' label='CV'>
            <Button onClick={handleDownloadFile}>Tải CV</Button>
          </Form.Item>

          <Form.Item<FormFieldType> name='recruitmentName' label='Vị trí tuyển dụng'>
            <Input placeholder='Vị trí tuyển dụng' readOnly />
          </Form.Item>

          <Form.Item<FormFieldType> name='description' label='Mô tả'>
            <Input.TextArea placeholder='Mô tả' readOnly />
          </Form.Item>

          <Form.Item<FormFieldType> name='status' label='Trạng thái'>
            <Select
              showSearch
              placeholder='Trạng thái'
              options={getApplicationStatusQuery.data?.map((item) => ({
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

      {/* Delete modal */}
      <Modal
        title={'Xóa thông tin'}
        open={isOpenConfirmDeleteModal}
        maskClosable={false}
        okText='Hoàn thành'
        cancelText='Hủy'
        onOk={handleDelete}
        confirmLoading={deleteApplicationByIdMutation.isPending}
        onCancel={handleCancelDeleting}
      >
        <div>Hành động này không thể khôi phục. Bạn chắc chắn muốn xóa thông tin này?</div>
      </Modal>
    </div>
  )
}

export default ApplicationPage

import { useMemo, useState } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, Input, InputNumber, Modal, notification, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import dayjs, { Dayjs } from 'dayjs'
import { GetGreatestGamesQueryResponseDataItemType, PostGreatestGamesRequestBodyType } from '~/types/greatestGameType'
import {
  useDeleteGreatestGamesMutation,
  useGetGreatestGamesQuery,
  usePatchGreatestGamesMutation,
  usePostGreatestGamesMutation
} from '~/stores/server/greatestGameStore'

interface FormType {
  whiteName: string
  whiteRating: number
  result: string
  blackName: string
  blackRating: number
  playedDate: Dayjs | null
  embedLink: string
  order: number
}

const FORM_INITIAL_VALUES: FormType = {
  whiteName: '',
  whiteRating: 0,
  result: '',
  blackName: '',
  blackRating: 0,
  playedDate: null,
  embedLink: '',
  order: 1
}

const GamePage = () => {
  const [form] = Form.useForm<FormType>()
  const [notificationApi, notificationContextHolder] = notification.useNotification()

  // States
  const [isOpenCreatingModal, setIsOpenCreatingModal] = useState<boolean>(false)
  const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] = useState<boolean>(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  // Stores
  const getGreatestGamesQuery = useGetGreatestGamesQuery()
  const postGreatestGamesMutation = usePostGreatestGamesMutation()
  const patchGreatestGamesMutation = usePatchGreatestGamesMutation()
  const deleteGreatestGamesMutation = useDeleteGreatestGamesMutation()

  // Constants
  const columns: ColumnsType<GetGreatestGamesQueryResponseDataItemType> = [
    {
      key: 'index',
      dataIndex: 'index',
      title: 'STT',
      width: '10%',
      align: 'center'
    },
    {
      key: 'whiteName',
      dataIndex: 'whiteName',
      title: 'Tên quân trắng',
      width: '20%'
    },
    {
      key: 'blackName',
      dataIndex: 'blackName',
      title: 'Tên quân đen',
      width: '20%'
    },
    {
      key: 'playedDate',
      dataIndex: 'playedDate',
      title: 'Ngày chơi',
      width: '20%',
      render: (value) => dayjs(value).format('DD/MM/YYYY')
    },
    {
      key: 'result',
      dataIndex: 'result',
      title: 'Kết quả',
      width: '15%'
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
                whiteName: record.whiteName,
                blackName: record.blackName,
                whiteRating: record.whiteRating,
                blackRating: record.blackRating,
                embedLink: record.embedLink,
                playedDate: dayjs(record.playedDate),
                result: record.result,
                order: record.order
              })
              setSelectedItemId(record._id)
              setIsOpenCreatingModal(true)
            }}
          />
          <Button
            shape='circle'
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedItemId(record._id)
              setIsOpenConfirmDeleteModal(true)
            }}
          />
        </div>
      )
    }
  ]

  // Methods
  const handleSubmit = async () => {
    try {
      const formValues = form.getFieldsValue()

      const requestBody: PostGreatestGamesRequestBodyType = {
        blackName: formValues.blackName.trim(),
        blackRating: formValues.blackRating,
        whiteName: formValues.whiteName.trim(),
        whiteRating: formValues.whiteRating,
        result: formValues.result.trim(),
        embedLink: formValues.embedLink.trim(),
        playedDate: formValues.playedDate?.toISOString() as string,
        order: formValues.order
      }

      selectedItemId
        ? await patchGreatestGamesMutation.mutateAsync({
            id: selectedItemId,
            requestBody
          })
        : await postGreatestGamesMutation.mutateAsync(requestBody)

      handleCancelCreating()
      return notificationApi.success({
        message: 'Thao tác thành công'
      })
    } catch (error) {
      console.error(error)
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
      await deleteGreatestGamesMutation.mutateAsync(selectedItemId)
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
    selectedItemId && setSelectedItemId(null)
    setIsOpenCreatingModal(false)
  }

  const handleCancelDeleting = () => {
    setSelectedItemId(null)
    setIsOpenConfirmDeleteModal(false)
  }

  // Memos
  const tableData = useMemo(
    () =>
      Array.isArray(getGreatestGamesQuery.data)
        ? getGreatestGamesQuery.data.map((item, index) => ({ ...item, index: index + 1, key: item._id }))
        : [],
    [getGreatestGamesQuery.data]
  )

  return (
    <div>
      {notificationContextHolder} <h1 className='text-xl font-medium'>Quản lý ván đấu</h1>
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
          loading={getGreatestGamesQuery.isLoading}
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
        confirmLoading={postGreatestGamesMutation.isPending || patchGreatestGamesMutation.isPending}
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
            name='whiteName'
            label='Tên quân trắng'
            rules={[
              {
                required: true,
                type: 'string',
                transform: (value) => value.trim(),
                message: 'Vui lòng nhập tên quân trắng'
              }
            ]}
          >
            <Input placeholder='Tên quân trắng' />
          </Form.Item>

          <Form.Item<FormType>
            name='whiteRating'
            label='Xếp hạng quân trắng'
            rules={[
              {
                required: true,
                type: 'number',
                message: 'Vui lòng nhập xếp hạng quân trắng'
              }
            ]}
          >
            <InputNumber placeholder='Xếp hạng quân trắng' className='w-full' />
          </Form.Item>

          <Form.Item<FormType>
            name='blackName'
            label='Tên quân đen'
            rules={[
              {
                required: true,
                type: 'string',
                transform: (value) => value.trim(),
                message: 'Vui lòng nhập tên quân đen'
              }
            ]}
          >
            <Input placeholder='Tên quân đen' />
          </Form.Item>

          <Form.Item<FormType>
            name='blackRating'
            label='Xếp hạng quân đen'
            rules={[
              {
                required: true,
                type: 'number',
                message: 'Vui lòng nhập xếp hạng quân đen'
              }
            ]}
          >
            <InputNumber placeholder='Xếp hạng quân đen' className='w-full' />
          </Form.Item>

          <Form.Item<FormType>
            name='playedDate'
            label='Ngày chơi'
            rules={[
              {
                required: true,
                type: 'object',
                message: 'Vui lòng nhập ngày chơi'
              }
            ]}
          >
            <DatePicker placeholder='Ngày chơi' format={'DD/MM/YYYY'} className='w-full' />
          </Form.Item>

          <Form.Item<FormType>
            name='result'
            label='Kết quả'
            rules={[
              {
                required: true,
                type: 'string',
                transform: (value) => value.trim(),
                message: 'Vui lòng nhập kết quả'
              }
            ]}
          >
            <Input placeholder='Kết quả' />
          </Form.Item>

          <Form.Item<FormType>
            name='embedLink'
            label='Link nhúng'
            rules={[
              {
                required: true,
                type: 'string',
                transform: (value) => value.trim(),
                message: 'Vui lòng nhập link nhúng'
              }
            ]}
          >
            <Input placeholder='Link nhúng' />
          </Form.Item>

          <Form.Item<FormType>
            name='order'
            label='Thứ tự'
            rules={[
              {
                required: true,
                type: 'number',
                message: 'Vui lòng nhập thứ tự'
              }
            ]}
          >
            <InputNumber placeholder='Thứ tự' min={1} max={99} className='w-full' />
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
        confirmLoading={deleteGreatestGamesMutation.isPending}
        onCancel={handleCancelDeleting}
      >
        <div>Hành động này không thể khôi phục. Bạn chắc chắn muốn xóa thông tin này?</div>
      </Modal>
    </div>
  )
}

export default GamePage

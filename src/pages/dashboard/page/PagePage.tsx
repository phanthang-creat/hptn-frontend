import { useMemo, useState } from 'react'
import { Button, Form, Input, Modal, Table, notification } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { generateCode } from '~/utils'
import {
  useGetPageQuery,
  usePostPageMutation,
  usePatchPageInfoByIdMutation,
  useDeletePageByIdMutation
} from '~/stores/server/pageStore'

interface PageForm {
  name: string
  code: string
  link: string
}

interface PageType {
  _id: string
  name: string
  code: string
  link: string
}

const FORM_INITIAL_VALUES = {
  name: '',
  code: '',
  link: ''
}

const PagesManagementPage = () => {
  const [form] = Form.useForm<PageForm>()
  const [notificationApi, notificationContextHolder] = notification.useNotification()

  // Stores
  const getPageQuery = useGetPageQuery()
  const postPageMutation = usePostPageMutation()
  const patchPageInfoByIdMutation = usePatchPageInfoByIdMutation()
  const deletePageByIdMutation = useDeletePageByIdMutation()

  // States
  const [isOpenCreatingModal, setIsOpenCreatingModal] = useState<boolean>(false)
  const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] = useState<boolean>(false)
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)

  // Constants
  const columns: ColumnsType<PageType> = [
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
      width: '25%'
    },
    {
      key: 'code',
      dataIndex: 'code',
      title: 'Code',
      width: '25%'
    },
    {
      key: 'link',
      dataIndex: 'link',
      title: 'Đường dẫn',
      width: '25%'
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
              setSelectedPageId(record._id)
              setIsOpenCreatingModal(true)
            }}
          />
          <Button
            shape='circle'
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedPageId(record._id)
              setIsOpenConfirmDeleteModal(true)
            }}
          />
        </div>
      )
    }
  ]

  // Methods
  const handleSubmitPage = async () => {
    try {
      const formValues = form.getFieldsValue()

      const pageData = {
        name: formValues.name.trim(),
        code: formValues.code,
        link: formValues.link.trim(),
        config: ''
      }

      selectedPageId
        ? await patchPageInfoByIdMutation.mutateAsync({
            id: selectedPageId,
            data: pageData
          })
        : await postPageMutation.mutateAsync(pageData)
      form.resetFields()
      selectedPageId && setSelectedPageId(null)
      setIsOpenCreatingModal(false)
      return notificationApi.success({
        message: selectedPageId ? 'Chỉnh sửa trang thành công' : 'Tạo trang thành công'
      })
    } catch (error) {
      return notificationApi.error({
        message: selectedPageId ? 'Chỉnh sửa trang thất bại' : 'Tạo trang thất bại'
      })
    }
  }

  const handleDeleteMenu = async () => {
    try {
      if (!selectedPageId) {
        return
      }
      await deletePageByIdMutation.mutateAsync(selectedPageId)
      selectedPageId && setSelectedPageId(null)
      setIsOpenConfirmDeleteModal(false)
      return notificationApi.success({
        message: 'Xóa trang thành công'
      })
    } catch (error) {
      return notificationApi.error({
        message: 'Xóa trang thất bại'
      })
    }
  }

  // Memo
  const tableData = useMemo(
    () =>
      getPageQuery.data ? getPageQuery.data.map((item, index) => ({ ...item, index: index + 1, key: item._id })) : [],
    [getPageQuery.data]
  )

  // Template
  return getPageQuery.data ? (
    <div>
      {notificationContextHolder}

      <h1 className='text-xl font-medium'>Quản lý trang</h1>

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
          onChange={(pagination: TablePaginationConfig) => console.log(pagination)}
        />
      </div>

      {/* Create/Update modal */}
      <Modal
        title={selectedPageId ? 'Chỉnh sửa thông tin' : 'Thêm mới thông tin'}
        open={isOpenCreatingModal}
        maskClosable={false}
        width={1000}
        okText='Hoàn thành'
        cancelText='Hủy'
        onOk={() => form.submit()}
        confirmLoading={postPageMutation.isPending || patchPageInfoByIdMutation.isPending}
        onCancel={() => {
          selectedPageId && setSelectedPageId(null)
          setIsOpenCreatingModal(false)
        }}
      >
        <Form
          form={form}
          initialValues={FORM_INITIAL_VALUES}
          layout='vertical'
          onFinish={handleSubmitPage}
          className='grid grid-cols-2 grid-flow-row gap-x-4'
        >
          <Form.Item
            name='name'
            label='Tên trang'
            rules={[
              { required: true, type: 'string', transform: (value) => value.trim(), message: 'Vui lòng nhập tên trang' }
            ]}
          >
            <Input placeholder='Tên' onChange={(e) => form.setFieldValue('code', generateCode(e.target.value))} />
          </Form.Item>

          <Form.Item name='code' label='Code'>
            <Input placeholder='Code' disabled />
          </Form.Item>

          <Form.Item
            name='link'
            label='Đường dẫn'
            rules={[
              { required: true, type: 'string', transform: (value) => value.trim(), message: 'Vui lòng nhập đường dẫn' }
            ]}
          >
            <Input placeholder='Đường dẫn' />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={'Xóa thông tin'}
        open={isOpenConfirmDeleteModal}
        maskClosable={false}
        okText='Hoàn thành'
        cancelText='Hủy'
        onOk={handleDeleteMenu}
        confirmLoading={deletePageByIdMutation.isPending}
        onCancel={() => {
          setSelectedPageId(null)
          setIsOpenConfirmDeleteModal(false)
        }}
      >
        <div>Hành động này không thể khôi phục. Bạn chắc chắn muốn xóa thông tin này?</div>
      </Modal>
    </div>
  ) : null
}

export default PagesManagementPage

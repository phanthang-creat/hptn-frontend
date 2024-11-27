import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, Table, notification } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useGetPostCategoryQuery, useDeletePostCategoryByIdMutation } from '~/stores/server/postCategoryStore'

import { GetPostCategoryItemResponseDataType } from '~/types/postCategoryType'

const PostCategoryPage = () => {
  const navigate = useNavigate()
  const [notificationApi, notificationContextHolder] = notification.useNotification()

  // States
  const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] = useState<boolean>(false)
  const [selectedPostCategoryId, setSelectedPostCategoryId] = useState<string | null>(null)

  // Stores
  const getPostCategoryQuery = useGetPostCategoryQuery()
  const deletePostCategoryByIdMutation = useDeletePostCategoryByIdMutation()

  // Constants
  const columns: ColumnsType<GetPostCategoryItemResponseDataType> = [
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
      width: '40%'
    },
    {
      key: 'slug',
      dataIndex: 'slug',
      title: 'Slug',
      width: '35%'
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
            onClick={() => navigate(`/dashboard/post-category/update/${record.id}`)}
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
  const handleDeletePage = async () => {
    try {
      if (!selectedPostCategoryId) {
        return
      }
      await deletePostCategoryByIdMutation.mutateAsync(selectedPostCategoryId)
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

  const handleCancelDeleting = () => {
    setSelectedPostCategoryId(null)
    setIsOpenConfirmDeleteModal(false)
  }

  // Memos
  const tableData = useMemo(
    () =>
      Array.isArray(getPostCategoryQuery.data)
        ? getPostCategoryQuery.data.map((item, index) => ({ ...item, index: index + 1, key: item.id }))
        : [],
    [getPostCategoryQuery.data]
  )

  // Template
  return (
    <div>
      {notificationContextHolder}

      <h1 className='text-xl font-medium'>Quản lý danh mục bài viết</h1>

      <div className='flex flex-col items-start gap-4'>
        <Button type='primary' className='self-end' onClick={() => navigate('/dashboard/post-category/creation')}>
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
          loading={getPostCategoryQuery.isLoading}
        />
      </div>

      {/* Delete modal */}
      <Modal
        title={'Xóa thông tin'}
        open={isOpenConfirmDeleteModal}
        maskClosable={false}
        okText='Hoàn thành'
        cancelText='Hủy'
        onOk={handleDeletePage}
        confirmLoading={deletePostCategoryByIdMutation.isPending}
        onCancel={handleCancelDeleting}
      >
        <div>Hành động này không thể khôi phục. Bạn chắc chắn muốn xóa thông tin này?</div>
      </Modal>
    </div>
  )
}

export default PostCategoryPage

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, Switch, Table, notification } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { BASE_URLS } from '~/configs'
import { useGetPostQuery, useDeletePostMutation } from '~/stores/server/postStore'
import { GetPostQueryItemResponseDataType } from '~/types/postType'

const PostPage = () => {
  const navigate = useNavigate()
  const [notificationApi, notificationContextHolder] = notification.useNotification()

  // States
  const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] = useState<boolean>(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 5
  })

  // Stores
  const getPostQuery = useGetPostQuery({
    page: pagination.page,
    take: pagination.pageSize
  })
  const deletePostMutation = useDeletePostMutation()

  // Constants
  const columns: ColumnsType<GetPostQueryItemResponseDataType> = [
    {
      key: 'index',
      dataIndex: 'index',
      title: 'STT',
      width: '10%',
      align: 'center'
    },
    {
      key: 'title',
      dataIndex: 'title',
      title: 'Tiêu đề',
      width: '25%'
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
      width: '25%'
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
            onClick={() => navigate(`/dashboard/post/update/${record.id}`)}
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
  const handleDeleteMenu = async () => {
    try {
      if (!selectedItemId) {
        return
      }
      await deletePostMutation.mutateAsync(selectedItemId)
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
    setSelectedItemId(null)
    setIsOpenConfirmDeleteModal(false)
  }

  // Memos
  const tableData = useMemo(
    () =>
      Array.isArray(getPostQuery.data?.data)
        ? getPostQuery.data.data.map((item, index) => ({ ...item, index: index + 1, key: item.id }))
        : [],
    [getPostQuery.data]
  )

  // Template
  return (
    <div>
      {notificationContextHolder}

      <h1 className='text-xl font-medium'>Quản lý bài viết</h1>

      <div className='flex flex-col items-start gap-4'>
        <Button type='primary' className='self-end' onClick={() => navigate('/dashboard/post/creation')}>
          Thêm mới
        </Button>

        {/* Table */}
        <Table
          className='w-full'
          columns={columns}
          dataSource={tableData}
          bordered
          pagination={{
            total: getPostQuery.data?.meta.itemCount,
            pageSize: pagination.pageSize,
            pageSizeOptions: [5, 10, 20],
            showSizeChanger: true
          }}
          loading={getPostQuery.isLoading}
          onChange={(pagination: TablePaginationConfig) =>
            setPagination({
              page: pagination.current ?? 1,
              pageSize: pagination.pageSize ?? 5
            })
          }
        />
      </div>

      <Modal
        title={'Xóa thông tin'}
        open={isOpenConfirmDeleteModal}
        maskClosable={false}
        okText='Hoàn thành'
        cancelText='Hủy'
        onOk={handleDeleteMenu}
        confirmLoading={deletePostMutation.isPending}
        onCancel={handleCancelDeleting}
      >
        <div>Hành động này không thể khôi phục. Bạn chắc chắn muốn xóa thông tin này?</div>
      </Modal>
    </div>
  )
}

export default PostPage

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, Switch, Table, notification } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { BASE_URLS } from '~/configs'
import { useGetRecruitmentQuery, useDeleteRecruitmentMutation } from '~/stores/server/recruitmentStore'
import { GetPostQueryItemResponseDataType } from '~/types/postType'

const RecruitmentPostPage = () => {
  const navigate = useNavigate()
  const [notificationApi, notificationContextHolder] = notification.useNotification()

  // Stores
  const getRecruitmentQuery = useGetRecruitmentQuery({})
  const deleteRecruitmentMutation = useDeleteRecruitmentMutation()

  // States
  const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] = useState<boolean>(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

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
            onClick={() => navigate(`/dashboard/recruitment-post/update/${record.id}`)}
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
      await deleteRecruitmentMutation.mutateAsync(selectedItemId)
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
      Array.isArray(getRecruitmentQuery.data?.data)
        ? getRecruitmentQuery.data.data.map((item, index) => ({ ...item, index: index + 1, key: item.id }))
        : [],
    [getRecruitmentQuery.data]
  )

  // Template
  return (
    <div>
      {notificationContextHolder}

      <h1 className='text-xl font-medium'>Quản lý bài viết</h1>

      <div className='flex flex-col items-start gap-4'>
        <Button type='primary' className='self-end' onClick={() => navigate('/dashboard/recruitment-post/creation')}>
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
          loading={getRecruitmentQuery.isLoading}
          onChange={(pagination: TablePaginationConfig) => console.log(pagination)}
        />
      </div>

      <Modal
        title={'Xóa thông tin'}
        open={isOpenConfirmDeleteModal}
        maskClosable={false}
        okText='Hoàn thành'
        cancelText='Hủy'
        onOk={handleDeleteMenu}
        confirmLoading={deleteRecruitmentMutation.isPending}
        onCancel={handleCancelDeleting}
      >
        <div>Hành động này không thể khôi phục. Bạn chắc chắn muốn xóa thông tin này?</div>
      </Modal>
    </div>
  )
}

export default RecruitmentPostPage

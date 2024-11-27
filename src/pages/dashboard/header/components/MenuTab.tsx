import { FC, useState, useMemo } from 'react'
import { Button, Checkbox, Form, Input, InputNumber, Modal, Switch, Table, notification } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { v4 as uuidv4 } from 'uuid'
import { usePatchHeadersMutation } from '~/stores/server/headerStore'
import { PanoHeaderDataType, PanoHeaderMenuType } from '~/types/headerType'

interface Props {
  data?: PanoHeaderDataType
}

const FORM_INITIAL_VALUES = {
  name: '',
  link: '',
  icon: '',
  order: 1,
  enabled: true
}

const MenuTab: FC<Props> = ({ data }) => {
  const [form] = Form.useForm<PanoHeaderMenuType>()
  const [notificationApi, notificationContextHolder] = notification.useNotification()

  // Stores
  const patchHeadersMutation = usePatchHeadersMutation()

  // States
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] = useState<boolean>(false)
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null)

  // Constants
  const columns: ColumnsType<PanoHeaderMenuType> = [
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
      width: '20%'
    },
    {
      key: 'link',
      dataIndex: 'link',
      title: 'Đường dẫn',
      width: '15%'
    },
    {
      key: 'icon',
      dataIndex: 'icon',
      title: 'Icon',
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
              setSelectedMenuId(record.id as string)
              setIsOpenModal(true)
            }}
          />
          <Button
            shape='circle'
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedMenuId(record.id as string)
              setIsOpenConfirmDeleteModal(true)
            }}
          />
        </div>
      )
    }
  ]

  // Methods
  const handleSubmitMenu = async () => {
    const formValues = form.getFieldsValue()
    const parsedData = data
      ? {
          logo: data.logo,
          menus: Array.isArray(data.menus) ? data.menus : [],
          button: data.button
        }
      : {
          logo: null,
          menus: [],
          button: null
        }

    const id = uuidv4()

    parsedData.menus = selectedMenuId
      ? parsedData.menus.map((menu) => (menu.id === selectedMenuId ? { ...menu, ...formValues } : menu))
      : [...parsedData.menus, { ...formValues, id, key: id, children: [] }]

    try {
      await patchHeadersMutation.mutateAsync(JSON.stringify({ data: parsedData }))
      setIsOpenModal(false)
      selectedMenuId && setSelectedMenuId(null)
      form.resetFields()
      return notificationApi.success({
        message: selectedMenuId ? 'Chỉnh sửa thông tin thành công' : 'Thêm mới thông tin thành công'
      })
    } catch (error) {
      return notificationApi.error({
        message: selectedMenuId ? 'Chỉnh sửa thông tin thất bại' : 'Thêm mới thông tin thất bại'
      })
    }
  }

  const handleDeleteMenu = async () => {
    try {
      const newMenus = Array.isArray(data?.menus) ? data?.menus.filter((menu) => menu.id !== selectedMenuId) : []
      await patchHeadersMutation.mutateAsync(JSON.stringify({ data: { ...data, menus: newMenus } }))
      setIsOpenConfirmDeleteModal(false)
      setSelectedMenuId(null)
      return notificationApi.success({
        message: 'Xóa thông tin thành công'
      })
    } catch (error) {
      return notificationApi.error({
        message: 'Xóa thông tin thất bại'
      })
    }
  }

  // Memo
  const tableData = useMemo(
    () =>
      data?.menus
        ? data?.menus.sort((a, b) => a.order - b.order).map((item, index) => ({ ...item, index: index + 1 }))
        : [],
    [data]
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
        title={selectedMenuId ? 'Chỉnh sửa thông tin' : 'Thêm mới thông tin'}
        open={isOpenModal}
        maskClosable={false}
        width={1000}
        okText='Hoàn thành'
        cancelText='Hủy'
        onOk={() => form.submit()}
        confirmLoading={patchHeadersMutation.isPending}
        onCancel={() => {
          selectedMenuId && setSelectedMenuId(null)
          setIsOpenModal(false)
        }}
      >
        <Form
          form={form}
          initialValues={FORM_INITIAL_VALUES}
          layout='vertical'
          onFinish={handleSubmitMenu}
          className='grid grid-cols-2 grid-flow-row gap-x-4'
        >
          <Form.Item
            name='name'
            label='Tên'
            rules={[
              { required: true, type: 'string', transform: (value) => value.trim(), message: 'Vui lòng nhập tên' }
            ]}
          >
            <Input placeholder='Tên' />
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

          <Form.Item name='icon' label='Icon'>
            <Input placeholder='Icon' />
          </Form.Item>

          <Form.Item
            name='order'
            label='Thứ tự'
            rules={[{ required: true, type: 'number', message: 'Vui lòng nhập thứ tự' }]}
          >
            <InputNumber placeholder='Thứ tự' min={1} className='w-full' />
          </Form.Item>

          <Form.Item name='enabled' valuePropName='checked'>
            <Checkbox defaultChecked={true}>Kích hoạt</Checkbox>
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
        confirmLoading={patchHeadersMutation.isPending}
        onCancel={() => {
          setSelectedMenuId(null)
          setIsOpenConfirmDeleteModal(false)
        }}
      >
        <div>Hành động này không thể khôi phục. Bạn chắc chắn muốn xóa thông tin này?</div>
      </Modal>
    </div>
  )
}

export default MenuTab

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, FC, useMemo } from 'react'
import { Button, Checkbox, Form, Input, InputNumber, Modal, Switch, Table } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { v4 as uuidv4 } from 'uuid'
import { HomePageConfigDataType, HomeSecondInformationItemType } from '~/types/homePageType'
import { PanoJoditEditor } from '~/components'

interface Props {
  pageConfigData: HomePageConfigDataType | null
  loading: boolean
  onUpdatePageConfig: (config: string) => Promise<void>
}

interface FormFieldType {
  title: string
  link: string
  order: number
  enabled: boolean
}

const FORM_INITIAL_VALUES: FormFieldType = {
  title: '',
  link: '',
  order: 1,
  enabled: true
}

const SecondInformation: FC<Props> = ({ pageConfigData, loading, onUpdatePageConfig }) => {
  const [form] = Form.useForm<FormFieldType>()

  // States
  const [summaryContent, setSummaryContent] = useState<string>('')
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] = useState<boolean>(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  // Constants
  const columns: ColumnsType<HomeSecondInformationItemType> = [
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
      key: 'link',
      dataIndex: 'link',
      title: 'Đường dẫn',
      width: '25%',
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
              setSummaryContent(record.summary)
              setSelectedItemId(record.id)
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
    setSummaryContent('')
    selectedItemId && setSelectedItemId(null)
    form.resetFields()
  }

  const resetDeletingStates = () => {
    setIsOpenConfirmDeleteModal(false)
    setSelectedItemId(null)
  }

  const handleSubmit = async () => {
    const formValues = form.getFieldsValue()

    const data: HomeSecondInformationItemType = {
      id: uuidv4(),
      title: formValues.title.trim(),
      summary: summaryContent,
      link: formValues.link.trim(),
      order: formValues.order,
      enabled: formValues.enabled
    }

    // Handle update
    await onUpdatePageConfig(
      JSON.stringify(
        pageConfigData
          ? {
              ...pageConfigData,
              secondInformation: Array.isArray(pageConfigData.secondInformation)
                ? selectedItemId
                  ? pageConfigData.secondInformation.map((item) =>
                      item.id === selectedItemId ? { ...data, id: item.id } : item
                    )
                  : [...pageConfigData.secondInformation, data]
                : [data]
            }
          : {
              secondInformation: [data]
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
        secondInformation: Array.isArray(pageConfigData.secondInformation)
          ? pageConfigData.secondInformation.filter((item) => item.id !== selectedItemId)
          : []
      })
    )

    // Reset
    resetDeletingStates()
  }

  // Memo
  const tableData = useMemo(
    () =>
      Array.isArray(pageConfigData?.secondInformation)
        ? pageConfigData.secondInformation
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
        centered
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
          className='flex gap-y-4 items-start -mx-2 flex-wrap max-h-96 overflow-y-auto'
        >
          <Form.Item<FormFieldType>
            name='title'
            label='Tiêu đề'
            rules={[
              { required: true, type: 'string', transform: (value) => value.trim(), message: 'Vui lòng nhập tiêu đề' }
            ]}
            className='px-2 w-1/2'
          >
            <Input placeholder='Tiêu đề' />
          </Form.Item>

          <Form.Item<FormFieldType>
            name='link'
            label='Đường dẫn'
            rules={[
              { required: true, type: 'string', transform: (value) => value.trim(), message: 'Vui lòng nhập đường dẫn' }
            ]}
            className='px-2 w-1/2'
          >
            <Input placeholder='Đường dẫn' />
          </Form.Item>

          <Form.Item label='Nội dung tóm tắt' className='px-2 w-full'>
            <PanoJoditEditor content={summaryContent} onChange={setSummaryContent} />
          </Form.Item>

          <Form.Item<FormFieldType>
            name='order'
            label='Thứ tự'
            rules={[{ required: true, type: 'number', message: 'Vui lòng nhập thứ tự' }]}
            className='px-2 w-1/2'
          >
            <InputNumber placeholder='Thứ tự' min={1} className='w-full' />
          </Form.Item>

          <Form.Item<FormFieldType> name='enabled' valuePropName='checked' className='px-2 w-1/2'>
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

export default SecondInformation

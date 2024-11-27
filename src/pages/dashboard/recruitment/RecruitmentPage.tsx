/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Button, Form, Switch, notification, Table, Modal, Upload, Input, InputNumber, Checkbox } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { BASE_URLS, PAGE_CODES } from '~/configs'
import { handleBeforeUpload, handleChangeUploadImage } from '~/utils'
import { RecruitmentPageSectionDataType } from '~/types/recruimentPageType'
import { useGetPageByCodeQuery, usePatchPageConfigByIdMutation } from '~/stores/server/pageStore'
import { usePostUploadFilesMutation } from '~/stores/server/fileUploadStore'

interface FormType {
  title: string
  image: File | null | string
  description: string
  order: number
  enabled: boolean
}

const FORM_INITIAL_VALUES: FormType = {
  title: '',
  image: null,
  description: '',
  order: 1,
  enabled: true
}

const RecruitmentPage = () => {
  const [notificationApi, notificationContextHolder] = notification.useNotification()
  const [form] = Form.useForm<FormType>()

  // Stores
  const getPageByCodeQuery = useGetPageByCodeQuery({ code: PAGE_CODES.TUYEN_DUNG })
  const patchPageConfigByIdMutation = usePatchPageConfigByIdMutation({ code: PAGE_CODES.TUYEN_DUNG })
  const postUploadFilesMutation = usePostUploadFilesMutation()

  // States
  const [pageConfigData, setPageConfigData] = useState<Array<RecruitmentPageSectionDataType>>()
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] = useState<boolean>(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  // Constants
  const columns: ColumnsType<RecruitmentPageSectionDataType> = [
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
      width: '30%'
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
              setSelectedItemId(record.id)
              setIsOpenModal(true)
              setImageUrl(BASE_URLS.uploadEndPoint + record.image)
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
  const handleUploadFile = useCallback(async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('files', file)
      const uploadFileResponse = await postUploadFilesMutation.mutateAsync(formData)
      return uploadFileResponse.data[0].path
    } catch (error) {
      notificationApi.error({
        message: 'Thao tác thất bại'
      })
      return null
    }
  }, [])

  const resetCreatingStates = () => {
    form.resetFields()
    setIsOpenModal(false)
    selectedItemId && setSelectedItemId(null)
    if (imageUrl && !imageUrl.startsWith(BASE_URLS.uploadEndPoint)) {
      window.URL.revokeObjectURL(imageUrl)
    }
    imageUrl && setImageUrl(null)
  }

  const resetDeletingStates = () => {
    setIsOpenConfirmDeleteModal(false)
    setSelectedItemId(null)
  }

  const handleSubmit = async () => {
    try {
      if (!getPageByCodeQuery.data) {
        return
      }

      const formValues = form.getFieldsValue()

      const dataImageUrl =
        formValues.image instanceof File ? await handleUploadFile(formValues.image) : formValues.image
      if (!dataImageUrl) {
        return
      }

      const data: RecruitmentPageSectionDataType = {
        id: uuidv4(),
        title: formValues.title.trim(),
        description: formValues.description.trim(),
        image: dataImageUrl,
        order: formValues.order,
        enabled: formValues.enabled
      }

      // Handle update
      await patchPageConfigByIdMutation.mutateAsync({
        id: getPageByCodeQuery.data._id,
        config: JSON.stringify(
          Array.isArray(pageConfigData)
            ? selectedItemId
              ? pageConfigData.map((item) => (item.id === selectedItemId ? { ...data, id: item.id } : item))
              : [...pageConfigData, data]
            : [data]
        )
      })

      resetCreatingStates()
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
      if (!selectedItemId || !getPageByCodeQuery.data) {
        return
      }

      await patchPageConfigByIdMutation.mutateAsync({
        id: getPageByCodeQuery.data._id,
        config: JSON.stringify(
          Array.isArray(pageConfigData) ? pageConfigData.filter((item) => item.id !== selectedItemId) : []
        )
      })

      resetDeletingStates()
      return notificationApi.success({
        message: 'Thao tác thành công'
      })
    } catch (error) {
      return notificationApi.error({
        message: 'Thao tác thất bại'
      })
    }
  }

  // Effects
  useEffect(() => {
    try {
      if (!getPageByCodeQuery.data || !getPageByCodeQuery.data?.config) {
        return
      }

      const pageConfigData = JSON.parse(getPageByCodeQuery.data.config)
      setPageConfigData(pageConfigData)
    } catch (error) {
      return
    }
  }, [getPageByCodeQuery.data])

  // Memos
  const tableData = useMemo(
    () =>
      Array.isArray(pageConfigData)
        ? pageConfigData
            .sort((a, b) => a.order - b.order)
            .map((item, index) => ({ ...item, index: index + 1, key: item.id }))
        : [],
    [pageConfigData]
  )

  // Template
  return (
    <div>
      {notificationContextHolder}
      <h1 className='text-xl font-medium'>Quản lý trang Tuyển dụng</h1>

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
          confirmLoading={patchPageConfigByIdMutation.isPending || postUploadFilesMutation.isPending}
          onCancel={resetCreatingStates}
        >
          <Form
            form={form}
            initialValues={FORM_INITIAL_VALUES}
            layout='vertical'
            onFinish={handleSubmit}
            className='grid grid-cols-2 grid-flow-row gap-x-4 h-[60vh] overflow-y-auto'
          >
            <Form.Item<FormType>
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
                  <img src={imageUrl} alt='avatar' className='w-[100px] h-[100px] object-contain' />
                ) : (
                  <div>
                    <PlusOutlined />
                    <div className='mt-2'>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item<FormType>
              name='title'
              label='Tiêu đề'
              rules={[
                { required: true, type: 'string', transform: (value) => value.trim(), message: 'Vui lòng nhập tiêu đề' }
              ]}
            >
              <Input placeholder='Tiêu đề' />
            </Form.Item>

            <Form.Item<FormType>
              name='order'
              label='Thứ tự'
              rules={[{ required: true, type: 'number', message: 'Vui lòng nhập thứ tự' }]}
            >
              <InputNumber placeholder='Thứ tự' min={1} className='w-full' />
            </Form.Item>

            <Form.Item<FormType> name='description' label='Mô tả' className='col-span-2'>
              <Input.TextArea placeholder='Mô tả' rows={4} />
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
          confirmLoading={patchPageConfigByIdMutation.isPending || postUploadFilesMutation.isPending}
          onCancel={resetDeletingStates}
        >
          <div>Hành động này không thể khôi phục. Bạn chắc chắn muốn xóa thông tin này?</div>
        </Modal>
      </div>
    </div>
  )
}

export default RecruitmentPage

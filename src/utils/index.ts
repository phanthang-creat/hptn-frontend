import { NotificationInstance } from 'antd/es/notification/interface'
import { UploadChangeParam, UploadFile } from 'antd/es/upload'
import slugify from 'slugify'

// Generate slug
const generateSlug = (text: string) =>
  slugify(text, {
    replacement: '-',
    remove: /[*+~,.()/\]'"!:@?]/g,
    lower: true,
    locale: 'vi',
    trim: true
  })

// Generate code
const generateCode = (text: string) =>
  slugify(text, {
    replacement: '_',
    remove: /[*+~,.()/\]'"!:@?]/g,
    locale: 'vi',
    trim: true
  }).toUpperCase()

// Handle before upload file
const handleBeforeUpload = () => false

// Handle change upload image
const handleChangeUploadImage = (
  info: UploadChangeParam<UploadFile>,
  notificationApi: NotificationInstance,
  callback?: VoidFunction
) => {
  const isImage = !!info.file.type && info.file.type.startsWith('image')
  if (!isImage) {
    return notificationApi.warning({
      message: 'Vui lòng chọn ảnh'
    })
  }

  const isLt10M = info.file.size! / 1024 / 1024 < 10
  if (!isLt10M) {
    return notificationApi.warning({
      message: 'Vui lòng chọn ảnh có kích thước tối đa 10MB'
    })
  }
  callback && callback()
}

export { generateSlug, generateCode, handleBeforeUpload, handleChangeUploadImage }

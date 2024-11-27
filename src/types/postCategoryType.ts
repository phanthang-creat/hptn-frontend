interface GetPostCategoryItemResponseDataType {
  id: string
  name: string
  slug: string
  image: string
  description: string
  parentId: string | null
  createdAt: string
  enabled: true
  updatedAt: string
  order: number
  children: Array<GetPostCategoryItemResponseDataType>
  images: Array<{
    id: string
    postCategoryId: string
    image: string
    createdAt: string
    updatedAt: string
  }>
}

interface PostPostCategoryRequestBodyType {
  name: string
  slug: string
  image: string | null
  description: string
  parentId: string | null
  order: number
  enabled: boolean
  images: Array<{
    image: string
  }>
}

export type { PostPostCategoryRequestBodyType, GetPostCategoryItemResponseDataType }

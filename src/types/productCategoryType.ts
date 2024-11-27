interface GetProductCategoryResponseDataType {
  id: string
  name: string
  slug: string
  image: string
  description: string
  parentId: string | null
  enabled: boolean
  order: number
  createdAt: string
  updatedAt: string
  children: GetProductCategoryResponseDataType[]
}

interface PostProductCategoryRequestBodyType {
  name: string
  slug: string
  image: string
  description: string
  order: number
  parentId: string | null
  enabled: boolean
}

export type { GetProductCategoryResponseDataType, PostProductCategoryRequestBodyType }

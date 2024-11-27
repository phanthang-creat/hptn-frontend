interface GetProductResponseDataItemType {
  id: string
  image: string
  name: string
  price: number
  shortContent: string
  slug: string
  enabled: boolean
  description: string
  createdAt: string
  updatedAt: string
  category: {
    id: string
    createdAt: string
    description: string
    enabled: boolean
    image: string
    name: string
    order: number
    parentId: string | null
    slug: string
    updatedAt: string
  }
}

interface GetProductResponseDataType {
  data: Array<GetProductResponseDataItemType>
  meta: {
    page: number
    pageCount: number
    itemCount: number
    take: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

interface GetProductByIdResponseDataType {
  id: string
  name: string
  slug: string
  image: string
  description: string
  shortContent: string
  content: string
  categoryId: string
  price: number
  quantity: number
  enabled: boolean
  createdAt: string
  updatedAt: string
  category: {
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
  }
  images: Array<{
    id: string
    productId: string
    image: string
    createdAt: string
    updatedAt: string
  }>
}

interface PostProductRequestBodyType {
  name: string
  slug: string
  description: string
  shortContent: string
  content: string
  image: string
  enabled: boolean
  categoryId: string
  price: string
  quantity: number
  images: Array<{
    image: string
  }>
}

export type {
  PostProductRequestBodyType,
  GetProductResponseDataType,
  GetProductResponseDataItemType,
  GetProductByIdResponseDataType
}

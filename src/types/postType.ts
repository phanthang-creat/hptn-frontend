interface GetPostQueryItemResponseDataType {
  id: string
  title: string
  slug: string
  image: string
  description: string
  shortContent: string
  enabled: boolean
  createdAt: string
  updatedAt: string
}

interface GetPostByIdQueryResponseDataType {
  id: string
  title: string
  slug: string
  image: string
  description: string
  shortContent: string
  content: string
  postCategoryId: string
  enabled: boolean
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
    slug: string
    image: string
    description: string
    parentId: null
    createdAt: string
    enabled: boolean
    updatedAt: string
    order: number
  }
}

interface PostPostRequestBodyType {
  title: string
  slug: string
  description: string
  shortContent: string
  content: string
  image: string
  enabled: boolean
  postCategoryId: string
}

export type { PostPostRequestBodyType, GetPostQueryItemResponseDataType, GetPostByIdQueryResponseDataType }

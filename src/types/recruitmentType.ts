interface PostRecruitmentRequestBodyType {
  title: string
  slug: string
  image: string
  description: string
  shortContent: string
  content: string
  enabled: boolean
  typeId: number
  positionId: number
  address: string
}

interface GetRecruitmentResponseDataType {
  data: Array<Omit<GetRecruitmentByIdResponseDataType, 'content'>>
  meta: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    itemCount: number
    page: number
    pageCount: number
    take: number
  }
}

interface GetRecruitmentByIdResponseDataType {
  id: string
  title: string
  slug: string
  image: string
  description: string
  shortContent: string
  content: string
  enabled: boolean
  typeId: number
  positionId: number
  address: string
  createdAt: string
  updatedAt: string
  type: {
    id: 2
    name: string
    slug: string
    createdAt: string
    updatedAt: string
  }
  position: {
    id: 1
    name: string
    slug: string
    createdAt: string
    updatedAt: string
  }
}

export type { PostRecruitmentRequestBodyType, GetRecruitmentByIdResponseDataType, GetRecruitmentResponseDataType }

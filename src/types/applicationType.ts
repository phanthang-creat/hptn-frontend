interface GetApplicationQueryItemResponseDataType {
  id: string
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  cv: string
  recruitmentId: string
  description: string
  status: number
  createdAt: string
  updatedAt: string
  recruitment: {
    id: string
    title: string
    image: string
    position: {
      id: number
      name: string
      slug: string
      createdAt: string
      updatedAt: string
    }
  }
  applicationStatus: {
    id: number
    name: string
  }
}

interface GetApplicationQueryResponseDataType {
  data: GetApplicationQueryItemResponseDataType[]
  meta: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    itemCount: number
    page: number
    pageCount: number
    take: number
  }
}

interface PostApplicationRequestBodyType {
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  cv: string
  recruitmentId: string
  description: string
}

interface PatchApplicationRequestBodyType extends PostApplicationRequestBodyType {
  status: number
}

export type {
  PostApplicationRequestBodyType,
  PatchApplicationRequestBodyType,
  GetApplicationQueryResponseDataType,
  GetApplicationQueryItemResponseDataType
}

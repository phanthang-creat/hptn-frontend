interface GetGreatestGamesQueryResponseDataItemType {
  _id: string
  whiteName: string
  whiteRating: number
  result: string
  blackName: string
  blackRating: number
  playedDate: string
  embedLink: string
  order: number
  createdAt: string
  updatedAt: string
}

interface PostGreatestGamesRequestBodyType {
  whiteName: string
  whiteRating: number
  result: string
  blackName: string
  blackRating: number
  playedDate: string
  embedLink: string
  order: number
}

export type { GetGreatestGamesQueryResponseDataItemType, PostGreatestGamesRequestBodyType }

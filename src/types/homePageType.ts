interface HomeBannerType {
  title: string
  subTitle: string
  image: string
  buttonText: string
  buttonLink: string
}

interface HomeFirstInformationType {
  id: string
  title: string
  image: string
  link: string
  order: number
  enabled: boolean
}

interface HomeSecondInformationItemType {
  id: string
  title: string
  summary: string
  link: string
  order: number
  enabled: boolean
}

interface HomePageConfigDataType {
  banner?: HomeBannerType
  generalIntroduction?: string
  treeDiagram?: string
  firstInformation?: Array<HomeFirstInformationType>
  secondInformation?: Array<HomeSecondInformationItemType>
  chessNews: {
    title: string
    postCategorySlug: string
    quantity: number
  }
  activityNews: {
    title: string
    postCategorySlug: string
    quantity: number
  }
  outstandingImages: string[]
}

export type { HomePageConfigDataType, HomeBannerType, HomeFirstInformationType, HomeSecondInformationItemType }

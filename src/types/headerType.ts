interface PanoHeaderMenuType {
  id?: string
  key?: string
  name: string
  link: string
  icon: string
  enabled: boolean
  order: number
  children: Array<PanoHeaderMenuType>
}

interface PanoHeaderLogoType {
  label: string
  image: string
  link: string
}

interface PanoHeaderButtonType {
  label: string
  link: string
}

interface PanoHeaderDataType {
  logo?: PanoHeaderLogoType | null
  menus?: Array<PanoHeaderMenuType> | null
  button?: PanoHeaderButtonType | null
}

export type { PanoHeaderMenuType, PanoHeaderLogoType, PanoHeaderButtonType, PanoHeaderDataType }

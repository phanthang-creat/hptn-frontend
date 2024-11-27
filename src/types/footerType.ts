/* eslint-disable @typescript-eslint/no-explicit-any */
type PanoFooterSectionCode = 'GENERAL' | 'FOLLOW_US' | 'ABOUT_US' | 'INFORMATION' | 'MAP'

// data?:
//     | {
//         logo?: string
//         brand?: string
//         address?: string
//       }
//     | Array<{
//         id?: string
//         image?: string
//         label?: string
//         link?: string
//       }>
//     | { lat?: number; lng?: number }

interface PanoFooterSectionDataType {
  code: PanoFooterSectionCode
  title: string
  data?: any
}

export type { PanoFooterSectionDataType, PanoFooterSectionCode }

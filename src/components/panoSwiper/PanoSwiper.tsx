import { ReactNode, FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Grid, Pagination, Autoplay } from 'swiper/modules'
import { GridOptions, PaginationOptions, SwiperOptions } from 'swiper/types'
import { v4 as uuidv4 } from 'uuid'
import './PanoSwiper.scss'

interface Props {
  slides?: ReactNode[]
  breakpoints?: {
    [width: number]: SwiperOptions
    [ratio: string]: SwiperOptions
  }
  slidesPerView?: number | 'auto'
  slidesPerGroup?: number
  spaceBetween?: string | number
  grid?: GridOptions
  pagination?: boolean | PaginationOptions
  loop?: boolean
}

const BREAK_POINTS = {
  0: {
    slidesPerView: 1,
    slidesPerGroup: 1
  },
  640: {
    slidesPerView: 2,
    slidesPerGroup: 2
  },
  768: {
    slidesPerView: 3,
    slidesPerGroup: 3
  },
  1024: {
    slidesPerView: 4,
    slidesPerGroup: 4
  }
}

const PanoSwiper: FC<Props> = ({
  slides = [],
  breakpoints = BREAK_POINTS,
  slidesPerView = 4,
  slidesPerGroup = 4,
  spaceBetween = 32,
  grid = { rows: 1, fill: 'row' },
  pagination = false,
  loop = false
}) => {
  return (
    <Swiper
      className='pano-swiper'
      modules={[Grid, Navigation, Pagination, Autoplay]}
      breakpoints={breakpoints}
      slidesPerView={slidesPerView}
      slidesPerGroup={slidesPerGroup}
      spaceBetween={spaceBetween}
      navigation={true}
      loop={loop}
      pagination={pagination}
      grid={grid}
      centerInsufficientSlides={true}
      grabCursor={true}
    >
      {slides.map((slide) => (
        <SwiperSlide key={uuidv4()}>{slide}</SwiperSlide>
      ))}
    </Swiper>
  )
}

export default PanoSwiper

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pagination } from 'antd'
import dayjs from 'dayjs'
import { PanoImage, PanoSwiper } from '~/components'
import { BASE_URLS, PAGE_CODES } from '~/configs'
import { useGetPageByCodeQuery } from '~/stores/server/pageStore'
import { ChessKnowledgePageConfigDataType, ChessKnowledgeSectionType } from '~/types/chessKnowledgePageType'
import { useGetPostListByPostCategorySlugQuery } from '~/stores/server/postStore'
import './chessKnowledgePage.scss'

// interface FilterType {
//   title: string
//   dateRange: [Dayjs, Dayjs] | null
// }

// interface QueryFilterType {
//   title?: string
//   minDate?: string
//   maxDate?: string
// }

// const { RangePicker } = DatePicker

const CARD_BREAK_POINTS = {
  0: {
    slidesPerView: 1,
    slidesPerGroup: 1
  },
  640: {
    slidesPerView: 2,
    slidesPerGroup: 2
  },
  1024: {
    slidesPerView: 3,
    slidesPerGroup: 3
  }
}

const Card = ({ data }: { data: ChessKnowledgeSectionType }) => (
  <Link to={`/danh-muc-bai-viet/${data.postCategorySlug}`} className='h-full p-2 bg-white block'>
    <div className='p-8 h-full flex flex-col gap-4 shadow-pano-1 rounded cursor-pointer hover:-translate-y-1 duration-200 transition'>
      <PanoImage
        src={BASE_URLS.uploadEndPoint + data.image}
        containerClassNames='aspect-video rounded overflow-hidden'
        imgClassNames='object-cover w-full'
      />

      <div className='flex flex-col items-center gap-4'>
        <h4 className='text-base font-medium text-center'>{data.title}</h4>
        <h5 className='text-center text-[#525252]'>{data.subTitle}</h5>
      </div>
    </div>
  </Link>
)

const ChessKnowledgePage = () => {

  // Title
  document.title = 'Kiến thức - Trung tâm cờ vua Pano Chess'

  // States
  const [pageConfigData, setPageConfigData] = useState<ChessKnowledgePageConfigDataType>()
  const [page, setPage] = useState<number>(1)
  // const [filter, setFilter] = useState<FilterType>({
  //   title: '',
  //   dateRange: null
  // })
  // const [queryFilter, setQueryFilter] = useState<QueryFilterType>({
  //   title: '',
  //   minDate: undefined,
  //   maxDate: undefined
  // })

  // Stores
  const getPageByCodeQuery = useGetPageByCodeQuery({
    code: PAGE_CODES.KIEN_THUC_CO
  })
  const getPostListByPostCategorySlugQuery = useGetPostListByPostCategorySlugQuery({
    postCategorySlug: pageConfigData?.educationKnowledge.postCategorySlug,
    page,
    enabled: true
    // title: queryFilter.title,
    // minDate: queryFilter.minDate,
    // maxDate: queryFilter.maxDate
  })

  // Methods
  // const handleApplyFilter = () => {
  //   setQueryFilter({
  //     title: filter.title.trim(),
  //     minDate: filter.dateRange?.[0] ? filter.dateRange?.[0].toISOString() : undefined,
  //     maxDate: filter.dateRange?.[1] ? filter.dateRange?.[1].toISOString() : undefined
  //   })
  // }

  // const handleRemoveFilter = () => {
  //   setFilter({ title: '', dateRange: null })
  // }

  // Effects
  // Listen page config data was fetched
  useEffect(() => {
    try {
      if (!getPageByCodeQuery.data) {
        return
      }
      const parsedData: ChessKnowledgePageConfigDataType = JSON.parse(getPageByCodeQuery.data.config)
      parsedData && setPageConfigData(parsedData)
    } catch (error) {
      return
    }
  }, [getPageByCodeQuery.data])

  const numberOfSkeletonCard = window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3

  return (
    <div className='portal-chess-knowledge-page pano-container py-8 flex flex-col gap-8 overflow-hidden'>
      {/* Chess knowledge */}

      <div className=''>
        <h2 className='pano-title mb-8'>Kiến thức cờ</h2>
        {pageConfigData?.chessKnowledge ? (
          <PanoSwiper
            slides={pageConfigData.chessKnowledge
              .filter((item) => item.enabled)
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <Card data={item} />
              ))}
            breakpoints={CARD_BREAK_POINTS}
          />
        ) : (
          <div className='flex gap-8'>
            {Array(numberOfSkeletonCard)
              .fill(0)
              .map((_, index) => (
                <div key={index} className='flex-1 p-8 flex flex-col gap-4 bg-white rounded'>
                  <div className='h-40 bg-neutral-300 rounded animate-pulse'></div>
                  <div className='h-6 bg-neutral-300 rounded animate-pulse'></div>
                  <div className='h-5 bg-neutral-300 rounded animate-pulse'></div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Education knowledge */}
      <div className=''>
        <h2 className='pano-title mb-8'>Kiến thức giáo dục</h2>

        {getPostListByPostCategorySlugQuery.data ? (
          <div className=''>
            <div className=''>
              {/* Filter */}
              {/* <div className='w-full lg:w-1/3 px-8 flex flex-col gap-4 items-start'>
                <Input
                  allowClear
                  placeholder='Tiêu đề bài viết'
                  className='w-full py-0'
                  value={filter.title}
                  onChange={(e) => setFilter((prev) => ({ ...prev, title: e.target.value }))}
                />
                <RangePicker
                  className='w-full '
                  value={filter.dateRange}
                  format={'DD/MM/YYYY'}
                  onChange={(values) =>
                    setFilter((prev) => ({
                      ...prev,
                      dateRange: values ? [dayjs(values[0]?.toISOString()), dayjs(values[1]?.toISOString())] : null
                    }))
                  }
                />
                <div className='flex gap-4 self-end'>
                  <Button onClick={handleRemoveFilter}>Xóa bộ lọc</Button>
                  <Button type='primary' onClick={handleApplyFilter}>
                    Áp dụng
                  </Button>
                </div>
              </div> */}

              {/* Post list */}
              {getPostListByPostCategorySlugQuery.data.data.length === 0 && <div>Không có bài viết nào.</div>}

              {getPostListByPostCategorySlugQuery.data.data.length > 0 && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  {getPostListByPostCategorySlugQuery.data?.data.map((post) => (
                    <Link key={post.id} to={`/bai-viet/${post.slug}`} className='flex gap-4 items-center'>
                      <PanoImage
                        src={BASE_URLS.uploadEndPoint + post.image}
                        containerClassNames='aspect-square rounded w-[100px] overflow-hidden'
                        imgClassNames='object-cover w-full h-full'
                      />
                      <div className='flex-1 flex flex-col gap-1 xl:gap-2 items-start'>
                        <h3 className='text-base font-medium line-clamp-1'>{post.title}</h3>
                        <h4 className='text-[#525252] italic'>
                          Đăng ngày {dayjs(post.createdAt).format('DD/MM/YYYY')}
                        </h4>
                        <p className='text-[#525252] line-clamp-1'>{post.description}</p>
                      </div>
                    </Link>
                  ))}

                  {/* Pagination */}
                  <Pagination
                    current={page}
                    pageSize={getPostListByPostCategorySlugQuery.data.meta.take}
                    onChange={(page: number) => setPage(page)}
                    total={getPostListByPostCategorySlugQuery.data.meta.itemCount}
                    className='text-center col-span-1 md:col-span-2'
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {Array(2)
              .fill(0)
              .map((_, index) => (
                <div key={index} className='flex flex-col gap-4'>
                  <div className='flex gap-4 items-start'>
                    <div className='w-[100px] h-[100px] pano-animate-pulse'></div>

                    <div className='flex-1 flex flex-col gap-1 items-stretch'>
                      <div className='h-5 pano-animate-pulse'></div>
                      <div className='h-5 pano-animate-pulse'></div>
                      <div className='h-5 pano-animate-pulse'></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChessKnowledgePage

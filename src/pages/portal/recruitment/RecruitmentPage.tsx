import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pagination } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBriefcase, faChess, faClock, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { BASE_URLS, PAGE_CODES } from '~/configs'
import { RecruitmentPageSectionDataType } from '~/types/recruimentPageType'
import { useGetPageByCodeQuery } from '~/stores/server/pageStore'
import { useGetRecruitmentQuery } from '~/stores/server/recruitmentStore'
// import { useGetRecruitmentPositionQuery } from '~/stores/server/recruitmentPositionStore'
// import { useGetRecruitmentTypeQuery } from '~/stores/server/recruitmentTypeStore'
import { PanoImage } from '~/components'
import './recruitmentPage.scss'

// interface FilterType {
//   title: string
//   recruitmentTypeId?: number
//   recruitmentPositionId?: number
// }

// interface QueryFilterType {
//   title?: string
//   recruitmentTypeId?: number
//   recruitmentPositionId?: number
// }

const RecruitmentPage = () => {
  // States
  const [page, setPage] = useState<number>(1)

  // title
  document.title = 'Tuyển dụng - Trung tâm cờ vua Pano Chess'

  // const [filter, setFilter] = useState<FilterType>({
  //   title: '',
  //   recruitmentTypeId: undefined,
  //   recruitmentPositionId: undefined
  // })
  // const [queryFilter, setQueryFilter] = useState<QueryFilterType>({
  //   title: '',
  //   recruitmentTypeId: undefined,
  //   recruitmentPositionId: undefined
  // })

  // Stores
  // const getRecruitmentPositionQuery = useGetRecruitmentPositionQuery()
  // const getRecruitmentTypeQuery = useGetRecruitmentTypeQuery()
  const getPageByCodeQuery = useGetPageByCodeQuery({
    code: PAGE_CODES.TUYEN_DUNG
  })
  const getRecruitmentQuery = useGetRecruitmentQuery({
    page,
    enabled: true
    // title: queryFilter.title,
    // recruitmentTypeId: queryFilter.recruitmentTypeId,
    // recruitmentPositionId: queryFilter.recruitmentPositionId,
  })

  // Methods
  // const handleApplyFilter = () => {
  //   console.log(filter)
  //   setQueryFilter({
  //     title: filter.title.trim(),
  //     recruitmentTypeId: filter.recruitmentTypeId || undefined,
  //     recruitmentPositionId: filter.recruitmentPositionId || undefined
  //   })
  // }

  // const handleRemoveFilter = () => {
  //   setFilter({ title: '', recruitmentTypeId: undefined, recruitmentPositionId: undefined })
  // }

  // Memos
  const pageConfigData: Array<RecruitmentPageSectionDataType> | null = useMemo(() => {
    if (!getPageByCodeQuery.data?.config) {
      return null
    }
    const parsedData: Array<RecruitmentPageSectionDataType> = JSON.parse(getPageByCodeQuery.data.config)
    return Array.isArray(parsedData)
      ? parsedData.filter((item) => item.enabled).sort((a, b) => a.order - b.order)
      : null
  }, [getPageByCodeQuery.data])

  // Template
  return (
    <div className='portal-recruitment-page pano-container py-8 flex flex-col gap-8 overflow-hidden'>
      {/* First section */}

      <div>
        <h1 className='text-base sm:text-2xl md:text-4xl text-center font-medium'>
          VÌ SAO NÊN ỨNG TUYỂN VÀO{' '}
          <span className='text-[#b45f06] inline-flex gap-3 items-baseline'>
            <span>PANO CHESS</span> <FontAwesomeIcon icon={faChess} size='xl' />
          </span>
        </h1>

        {pageConfigData ? (
          <div className='flex flex-wrap gap-y-4 -mx-2 mt-8'>
            {pageConfigData.map((item) => (
              <div key={item.id} className='w-full md:w-1/2 xl:w-1/4 px-2'>
                <div className='flex flex-col md:flex-row items-center md:items-start gap-4'>
                  <PanoImage
                    src={BASE_URLS.uploadEndPoint + item.image}
                    containerClassNames='w-28 md:w-16'
                    imgClassNames='object-cover w-full'
                  />
                  {/* <img src={BASE_URLS.uploadEndPoint + item.image} alt='' className='w-28 md:w-16' /> */}
                  <div className='flex-1 flex flex-col gap-2'>
                    <h2 className='text-center md:text-left text-base md:text-lg font-medium text-[#b45f06]'>
                      {item.title}
                    </h2>
                    <p className='text-center md:text-left'>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex flex-wrap gap-y-4 -mx-2 mt-8'>
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className='w-full md:w-1/2 xl:w-1/4 px-2'>
                  <div className='flex flex-col md:flex-row items-center md:items-start gap-4'>
                    <div className='w-28 md:w-16 h-16 pano-animate-pulse'></div>
                    <div className='flex-1 w-full flex flex-col gap-2'>
                      <div className='h-5 pano-animate-pulse'></div>
                      <div className='h-5 pano-animate-pulse'></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Recruitment list */}
      <div className='flex flex-col lg:flex-row -mx-8 flex-wrap gap-y-4'>
        {/* Filter */}
        {/* <div className='w-full lg:w-1/3 px-8 flex flex-col gap-4 items-start'>
          <h2 className='text-base sm:text-xl lg:text-3xl font-medium mb-4'>Bộ lọc</h2>
          <Input
            allowClear
            placeholder='Tiêu đề bài viết'
            className='w-full py-0'
            value={filter.title}
            onChange={(e) => setFilter((prev) => ({ ...prev, title: e.target.value }))}
          />

          {getRecruitmentPositionQuery.data && (
            <Select
              value={filter.recruitmentPositionId}
              onChange={(value) => setFilter((prev) => ({ ...prev, recruitmentPositionId: value }))}
              showSearch
              placeholder='Vị trí tuyển dụng'
              options={getRecruitmentPositionQuery.data.map((item) => ({
                value: item.id.toString(),
                label: item.name
              }))}
              filterOption={(input: string, option?: { label: string; value: string }) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              className='w-full'
            />
          )}

          {getRecruitmentTypeQuery.data && (
            <Select
              value={filter.recruitmentTypeId}
              onChange={(value) => setFilter((prev) => ({ ...prev, recruitmentTypeId: value }))}
              showSearch
              placeholder='Loại tuyển dụng'
              options={getRecruitmentTypeQuery.data.map((item) => ({
                value: item.id.toString(),
                label: item.name
              }))}
              filterOption={(input: string, option?: { label: string; value: string }) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              className='w-full'
            />
          )}

          <div className='flex gap-4 self-end'>
            <Button onClick={handleRemoveFilter}>Xóa bộ lọc</Button>
            <Button type='primary' onClick={handleApplyFilter}>
              Áp dụng
            </Button>
          </div>
        </div> */}

        {/* Post list */}
        {getRecruitmentQuery.data ? (
          <div className='w-full px-8 flex flex-col gap-8'>
            <h2 className='pano-title'>Danh sách tuyển dụng</h2>
            {getRecruitmentQuery.data.data.length === 0 && <div>Không có bài tuyển dụng nào.</div>}

            {getRecruitmentQuery.data.data.length > 0 && (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                {getRecruitmentQuery.data.data.map((post) => (
                  <Link key={post.id} to={`/tuyen-dung/${post.slug}`} className='flex flex-col gap-4 items-start'>
                    <div className='flex gap-4 items-start'>
                      <PanoImage
                        src={BASE_URLS.uploadEndPoint + post.image}
                        containerClassNames='rounded aspect-square w-[100px] overflow-hidden'
                        imgClassNames='object-cover'
                      />

                      <div className='flex-1 flex flex-col gap-1 items-start'>
                        <h3 className='text-base font-medium line-clamp-1'>{post.title}</h3>
                        <div className='text-[#525252] italic flex items-center gap-2'>
                          <FontAwesomeIcon icon={faBriefcase} width={14} />
                          <span className='flex-1 line-clamp-1'>Vị trí tuyển dụng: {post.position.name}</span>
                        </div>
                        <div className='text-[#525252] italic flex items-center gap-2'>
                          <FontAwesomeIcon icon={faClock} width={14} />
                          <span className='flex-1 line-clamp-1'>Loại tuyển dụng: {post.type.name}</span>
                        </div>
                        <div className='text-[#525252] italic flex items-center gap-2'>
                          <FontAwesomeIcon icon={faLocationDot} width={14} />
                          <span className='flex-1 line-clamp-1'>Địa chỉ: {post.address}</span>
                        </div>
                      </div>
                    </div>

                    <p className=''>{post.description}</p>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            <Pagination
              current={page}
              pageSize={getRecruitmentQuery.data.meta.take}
              onChange={(page: number) => setPage(page)}
              total={getRecruitmentQuery.data.meta.itemCount}
              className='text-center'
            />
          </div>
        ) : (
          <div className='w-full px-8 flex flex-col gap-8'>
            <h2 className='text-lg sm:text-2xl md:text-4xl text-[#b45f06] font-bold'>Danh sách tuyển dụng</h2>
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
                        <div className='h-5 pano-animate-pulse'></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecruitmentPage

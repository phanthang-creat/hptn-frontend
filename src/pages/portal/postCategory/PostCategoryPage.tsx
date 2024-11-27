import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Pagination } from 'antd'
import dayjs from 'dayjs'
import { useGetPostListByPostCategorySlugQuery } from '~/stores/server/postStore'
import { useGetPostCategoryBySlugQuery } from '~/stores/server/postCategoryStore'
import { BASE_URLS } from '~/configs'
import { PanoImage } from '~/components'
import './postCategoryPage.scss'

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

const PostListPage = () => {
  const { slug } = useParams()

  // title
  document.title = 'Bài viết - Trung tâm cờ vua Pano Chess'

  // States
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
  const getPostListByPostCategorySlugQuery = useGetPostListByPostCategorySlugQuery({
    postCategorySlug: slug,
    page,
    // title: queryFilter.title,
    // minDate: queryFilter.minDate,
    // maxDate: queryFilter.maxDate,
    enabled: true
  })

  const getPostCategoryBySlugQuery = useGetPostCategoryBySlugQuery({
    slug
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

  return (
    <div className='portal-post-category-page pano-container py-8'>
      <div className='overflow-hidden'>
        <div className='flex flex-col md:flex-row -mx-8 flex-wrap gap-y-8'>
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
          <RangePicker
            className='w-full'
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
          {getPostListByPostCategorySlugQuery.data && getPostCategoryBySlugQuery.data ? (
            <div className='flex-1 px-8 flex flex-col gap-8'>
              <div className='flex flex-col gap-2'>
                <h2 className='pano-title'>{getPostCategoryBySlugQuery.data.name}</h2>

                {/* {getPostCategoryBySlugQuery.data.description && (
                  <h3 className='text-sm sm:text-xl md:text-2xl font-medium italic'>
                    {`"${getPostCategoryBySlugQuery.data.description}"`}
                  </h3>
                )} */}
              </div>

              {getPostListByPostCategorySlugQuery.data.data.length === 0 && <div>Không có bài viết nào.</div>}

              {getPostListByPostCategorySlugQuery.data?.data.map((post) => (
                <Link key={post.id} to={`/bai-viet/${post.slug}`} className='flex gap-4 items-center'>
                  <PanoImage
                    src={BASE_URLS.uploadEndPoint + post.image}
                    containerClassNames='rounded aspect-[4/3] w-[100px] overflow-hidden'
                    imgClassNames='object-cover'
                  />
                  {/* <img
                src={BASE_URLS.uploadEndPoint + post.image}
                alt=''
                width={100}
                height={100}
                className='object-cover rounded aspect-square'
              /> */}
                  <div className='flex-1 flex flex-col gap-1 items-start'>
                    <h3 className='text-base font-medium line-clamp-1'>{post.title}</h3>
                    <h4 className='text-[#525252] italic'>Đăng ngày {dayjs(post.createdAt).format('DD/MM/YYYY')}</h4>
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
                className='text-center'
              />
            </div>
          ) : (
            <div className='flex w-full px-8 md:w-2/3 flex-col gap-8'>
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className='flex items-center gap-4'>
                    <div className='animate-pulse w-[100px] h-[100px] rounded bg-neutral-300'></div>
                    <div className='flex-1 flex flex-col gap-1 items-stretch'>
                      <div className='animate-pulse h-5 rounded bg-neutral-300'></div>
                      <div className='animate-pulse h-5 rounded bg-neutral-300'></div>
                      <div className='animate-pulse h-5 rounded bg-neutral-300'></div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Post category images */}
          {getPostCategoryBySlugQuery.data && (
            <div className='hidden md:flex w-0 md:w-1/3 px-8 flex-col gap-8'>
              {getPostCategoryBySlugQuery.data.images.map((image) => (
                <div key={image.id}>
                  <PanoImage
                    src={BASE_URLS.uploadEndPoint + image.image}
                    containerClassNames='rounded w-full'
                    imgClassNames=''
                  />
                  {/* <img src={BASE_URLS.uploadEndPoint + image.image} alt='' className='rounded mx-auto max-w-full' /> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PostListPage

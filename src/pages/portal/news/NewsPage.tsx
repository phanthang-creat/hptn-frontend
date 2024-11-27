import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetPageByCodeQuery } from '~/stores/server/pageStore'
import { PAGE_CODES } from '~/configs'
import { NewsPageConfigDataType } from '~/types/newsPageType'
import './newsPage.scss'

const NewsPage = () => {
  const navigate = useNavigate()

  // Title
  document.title = 'Tin tức - Trung tâm cờ vua Pano Chess'

  // Stores
  const getPageByCodeQuery = useGetPageByCodeQuery({ code: PAGE_CODES.TIN_TUC })

  // Effects
  // Listen page config data was fetched
  useEffect(() => {
    try {
      if (!getPageByCodeQuery.data) {
        return
      }
      const parsedData: NewsPageConfigDataType = JSON.parse(getPageByCodeQuery.data.config)
      parsedData?.postCategorySlug && navigate(`/danh-muc-bai-viet/${parsedData?.postCategorySlug}`)
    } catch (error) {
      return
    }
  }, [getPageByCodeQuery.data])

  // return getPostListByPostCategorySlugQuery.data ? (
  //   <div className='portal-news-page pano-container py-8'>
  //     <div className='flex flex-col lg:flex-row -mx-8 flex-wrap gap-y-4'>
  //       {/* Filter */}
  //       <div className='w-full lg:w-1/3 px-8 flex flex-col gap-4 items-start'>
  //         <h2 className='text-base sm:text-xl lg:text-3xl font-medium'>Bộ lọc</h2>
  //         <Input
  //           allowClear
  //           placeholder='Tiêu đề bài viết'
  //           className='w-full py-0 focus:border-[#b45f06] hover:border-[#b45f06] active:border-[#b45f06]'
  //           value={filter.title}
  //           onChange={(e) => setFilter((prev) => ({ ...prev, title: e.target.value }))}
  //         />
  //         <RangePicker
  //           className='w-full focus:border-[#b45f06] hover:border-[#b45f06] active:border-[#b45f06]'
  //           value={filter.dateRange}
  //           format={'DD/MM/YYYY'}
  //           onChange={(values) =>
  //             setFilter((prev) => ({
  //               ...prev,
  //               dateRange: values ? [dayjs(values[0]?.toISOString()), dayjs(values[1]?.toISOString())] : null
  //             }))
  //           }
  //         />
  //         <div className='flex gap-4 self-end'>
  //           <Button onClick={handleRemoveFilter}>Xóa bộ lọc</Button>
  //           <Button type='primary' onClick={handleApplyFilter}>
  //             Áp dụng
  //           </Button>
  //         </div>
  //       </div>

  //       {/* Post list */}
  //       <div className='w-full lg:w-2/3 px-8 flex flex-col gap-4'>
  //         <h2 className='text-base sm:text-xl lg:text-3xl font-medium'>Danh sách tin tức</h2>
  //         {getPostListByPostCategorySlugQuery.data.data.length === 0 && <div>Không có tin tức nào.</div>}

  //         {getPostListByPostCategorySlugQuery.data?.data.map((post) => (
  //           <Link key={post.id} to={`/bai-viet/${post.slug}`} className='flex gap-4 items-start'>
  //             <img
  //               src={BASE_URLS.uploadEndPoint + post.image}
  //               alt=''
  //               width={100}
  //               height={100}
  //               className='object-cover rounded'
  //             />
  //             <div className='flex-1 flex flex-col gap-2 items-start'>
  //               <h3 className='text-base font-medium line-clamp-1'>{post.title}</h3>
  //               <p className='text-[#525252] line-clamp-2'>{post.description}</p>
  //             </div>
  //           </Link>
  //         ))}
  //         {/* Pagination */}
  //         <Pagination
  //           current={page}
  //           pageSize={getPostListByPostCategorySlugQuery.data.meta.take}
  //           onChange={(page: number) => setPage(page)}
  //           total={getPostListByPostCategorySlugQuery.data.meta.itemCount}
  //           className='text-center'
  //         />
  //       </div>
  //     </div>
  //   </div>
  // ) : null
  return null
}

export default NewsPage

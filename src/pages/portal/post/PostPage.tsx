import { Link, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { PanoImage, PanoJoditEditorContent } from '~/components'
import { BASE_URLS } from '~/configs'
import { useGetPostBySlugQuery, useGetPostListByPostCategorySlugQuery } from '~/stores/server/postStore'

const PostPage = () => {
  const { slug } = useParams()

  // Title
  document.title = 'Bài viết - Trung tâm cờ vua Pano Chess'

  //   Stores
  const getPostBySlugQuery = useGetPostBySlugQuery({
    slug
  })
  const getPostListByPostCategorySlugQuery = useGetPostListByPostCategorySlugQuery({
    postCategorySlug: getPostBySlugQuery.data?.category.slug,
    take: 10,
    excludeSlug: slug,
    enabled: true
  })

  return (
    <div className='pano-container py-8'>
      <div className='flex flex-col lg:flex-row flex-wrap gap-y-4 -mx-4'>
        {/* Post information */}
        {getPostBySlugQuery.data ? (
          <div className='px-4 w-full lg:w-3/4 flex flex-col gap-4'>
            <h2 className='text-[#b45f06] text-base sm:text-xl lg:text-3xl font-medium text-center'>
              {getPostBySlugQuery.data.title}
            </h2>
            <p className='text-[#525252]'>Đăng ngày {dayjs(getPostBySlugQuery.data.createdAt).format('DD/MM/YYYY')}</p>
            <PanoJoditEditorContent content={getPostBySlugQuery.data.content} />
          </div>
        ) : (
          <div className='px-4 w-full lg:w-3/4 flex flex-col gap-4'>
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className='h-8 bg-neutral-300 rounded animate-pulse'></div>
              ))}
          </div>
        )}

        {/* View more */}
        <div className='px-4 w-full lg:w-1/4 flex flex-col gap-4'>
          <h2 className='text-base sm:text-xl font-medium'>Xem thêm</h2>
          {getPostListByPostCategorySlugQuery.data ? (
            <>
              {getPostListByPostCategorySlugQuery.data.data.length === 0 && <div>Không có bài viết nào.</div>}

              {getPostListByPostCategorySlugQuery.data.data.length > 0 &&
                getPostListByPostCategorySlugQuery.data.data.map((post) => (
                  <Link key={post.id} to={`/bai-viet/${post.slug}`} className='flex gap-4 items-center'>
                    <PanoImage
                      src={BASE_URLS.uploadEndPoint + post.image}
                      containerClassNames='rounded overflow-hidden aspect-square w-[80px]'
                      imgClassNames='object-cover'
                    />
                    {/* <img
                      src={BASE_URLS.uploadEndPoint + post.image}
                      alt=''
                      width={80}
                      height={80}
                      className='object-cover rounded aspect-square'
                    /> */}
                    <div className='flex-1 flex flex-col gap-1 items-start'>
                      <h3 className='text-base font-medium line-clamp-1'>{post.title}</h3>
                      <h4 className='text-[#525252] italic'>Đăng ngày {dayjs(post.createdAt).format('DD/MM/YYYY')}</h4>
                      <p className='text-[#525252] line-clamp-1'>{post.description}</p>
                    </div>
                  </Link>
                ))}
            </>
          ) : (
            Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className='flex gap-4 items-center'>
                  <div className='w-[80px] h-[80px] rounded animate-pulse bg-neutral-300'></div>
                  <div className='flex-1 flex flex-col gap-1 items-stretch'>
                    {Array(3)
                      .fill(0)
                      .map((_, index) => (
                        <div key={index} className='w-full h-5 bg-neutral-300 animate-pulse rounded'></div>
                      ))}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  )
}

export default PostPage

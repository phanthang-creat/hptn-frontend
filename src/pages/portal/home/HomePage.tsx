import { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightOutlined } from '@ant-design/icons'
import htmlParse from 'html-react-parser'
import { InfiniteLooper, PanoImage, PanoJoditEditorContent, PanoSwiper } from '~/components'
import { PAGE_CODES, BASE_URLS } from '~/configs'
import { HomeFirstInformationType, HomePageConfigDataType } from '~/types/homePageType'
import { GetPostQueryItemResponseDataType } from '~/types/postType'
import { useGetPageByCodeQuery } from '~/stores/server/pageStore'
import { useGetPostListByPostCategorySlugQuery } from '~/stores/server/postStore'
import { useGetGreatestGamesQuery } from '~/stores/server/greatestGameStore'
import { MainLayoutContext } from '~/layouts/portal/main/MainLayout'
import HomePageSkeleton from './HomePageSkeleton'
import { GetGreatestGamesQueryResponseDataItemType } from '~/types/greatestGameType'
import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import './HomePage.scss'

const Card = ({ data }: { data: HomeFirstInformationType }) => (
  <div className='h-full p-2'>
    <div className='h-full shadow-pano-1 rounded p-8 flex flex-col gap-4 bg-white'>
      <PanoImage
        src={BASE_URLS.uploadEndPoint + data.image}
        containerClassNames='w-full aspect-video rounded overflow-hidden'
        imgClassNames='w-full h-full object-contain'
      />

      <div className='flex flex-col items-center gap-4 flex-1 justify-between'>
        <h4 className='text-base font-medium text-center'>{data.title}</h4>
        <Link
          to={data.link}
          target={data.link.startsWith('http') ? '_blank' : '_self'}
          className='
            border border-[#b45f06] outline-none
            text-sm text-[#b45f06]
            px-4 py-2 
            rounded bg-white hover:opacity-80 duration-200 transition-opacity
            flex items-center gap-1'
        >
          Xem thêm
          <ArrowRightOutlined />
        </Link>
      </div>
    </div>
  </div>
)

const Post = ({ post }: { post: GetPostQueryItemResponseDataType }) => {
  return (
    <div className='flex flex-col gap-4'>
      <h3 className='text-base md:text-lg font-medium line-clamp-none md:line-clamp-2 h-auto md:h-14'>{post.title}</h3>
      <PanoImage
        src={BASE_URLS.uploadEndPoint + post.image}
        containerClassNames='w-full aspect-video'
        imgClassNames='object-cover aspect-video'
      />
      <PanoJoditEditorContent content={post.shortContent} />
      <Link
        to={`/bai-viet/${post.slug}`}
        className='text-[#b45f06] text-xs sm:text-sm hover:text-opacity-80 duration-200 transition flex items-center gap-1'
      >
        Xem thêm
        <ArrowRightOutlined />
      </Link>
    </div>
  )
}

const CARD_BREAK_POINTS = {
  0: {
    slidesPerView: 1,
    slidesPerGroup: 1
  },
  450: {
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

const HomePage = () => {
  // title
  document.title = 'Trung tâm cờ vua Pano Chess'

  const { setIsOpenRegistrationModal } = useContext(MainLayoutContext)

  // States
  const [postCategorySlugOfChessNewsSection, setPostCategorySlugOfChessNewsSection] = useState<string>()
  const [postQuantityOfChessNewsSection, setPostQuantityOfChessNewsSection] = useState<number>(0)
  const [postCategorySlugOfActivityNewsSection, setPostCategorySlugOfActivityNewsSection] = useState<string>()
  const [postQuantityOfActivityNewsSection, setPostQuantityOfActivityNewsSection] = useState<number>(0)
  const [pageConfigData, setPageConfigData] = useState<HomePageConfigDataType>()
  const [selectedGame, setSelectedGame] = useState<GetGreatestGamesQueryResponseDataItemType>()

  // Stores
  const getPageByCodeQuery = useGetPageByCodeQuery({ code: PAGE_CODES.TRANG_CHU })
  const getPostListByPostCategorySlugQueryOfChessNewsSection = useGetPostListByPostCategorySlugQuery({
    postCategorySlug: postCategorySlugOfChessNewsSection,
    take: postQuantityOfChessNewsSection
  })

  const getPostListByPostCategorySlugQueryOfActivityNewsSection = useGetPostListByPostCategorySlugQuery({
    postCategorySlug: postCategorySlugOfActivityNewsSection,
    take: postQuantityOfActivityNewsSection
  })

  const getGreatestGamesQuery = useGetGreatestGamesQuery()

  // Constants
  const columns: ColumnsType<GetGreatestGamesQueryResponseDataItemType> = [
    {
      key: 'playedDate',
      dataIndex: 'playedDate',
      title: 'Played',
      width: '15%',
      render: (value) => dayjs(value).format('DD/MM/YYYY')
    },
    {
      key: 'whiteName',
      dataIndex: 'whiteName',
      title: 'White',
      width: '20%'
    },
    {
      key: 'whiteRating',
      dataIndex: 'whiteRating',
      title: 'White rating',
      width: '10%'
    },
    {
      key: 'result',
      dataIndex: 'result',
      title: 'Result',
      width: '15%'
    },
    {
      key: 'blackRating',
      dataIndex: 'blackRating',
      title: 'Black rating',
      width: '10%'
    },
    {
      key: 'blackName',
      dataIndex: 'blackName',
      title: 'Black',
      width: '20%'
    },
    {
      key: 'avRating',
      dataIndex: 'avRating',
      title: 'Av. rating',
      width: '10%',
      render: (_, record) => Math.floor((record.whiteRating + record.blackRating) / 2)
    }
  ]

  // Effects
  // Listen page config data was fetched
  useEffect(() => {
    try {
      if (!getPageByCodeQuery.data) {
        return
      }
      const parsedData: HomePageConfigDataType = JSON.parse(getPageByCodeQuery.data.config)
      parsedData && setPageConfigData(parsedData)
      parsedData?.chessNews?.postCategorySlug &&
        setPostCategorySlugOfChessNewsSection(parsedData.chessNews.postCategorySlug)
      parsedData?.chessNews?.quantity && setPostQuantityOfChessNewsSection(parsedData.chessNews.quantity)
      parsedData?.activityNews?.postCategorySlug &&
        setPostCategorySlugOfActivityNewsSection(parsedData.activityNews.postCategorySlug)
      parsedData?.activityNews?.quantity && setPostQuantityOfActivityNewsSection(parsedData.activityNews.quantity)
    } catch (error) {
      return
    }
  }, [getPageByCodeQuery.data])

  useEffect(() => {
    if (!getGreatestGamesQuery.data || getGreatestGamesQuery.data.length === 0) {
      return
    }
    setSelectedGame(getGreatestGamesQuery.data[0])
  }, [getGreatestGamesQuery.data])

  // Template
  return pageConfigData ? (
    <div className='portal-home-page flex flex-col gap-8 pb-8'>
      {/* Banner */}
      {pageConfigData.banner && <img src={BASE_URLS.uploadEndPoint + pageConfigData.banner.image} alt='' />}

      {/* Register button */}
      <button
        onClick={() => setIsOpenRegistrationModal(true)}
        className='
          animate-bounce text-base text-white 
          bg-[#b45f06] hover:bg-[#c3721d] 
          duration-200 transition
          px-8 py-4 rounded-full mx-auto 
          flex items-center gap-1'
      >
        Đăng ký ngay
        <ArrowRightOutlined />
      </button>

      {/* General information & Tree diagram */}
      <div className='pano-container'>
        <div className='flex gap-4 items-start md:items-center flex-col-reverse md:flex-row'>
          {pageConfigData.generalIntroduction && (
            <div className='w-full md:w-1/2'>
              <div className='flex flex-col items-center gap-1 bg-[#fdd247] px-0 py-2 mb-8'>
                <div className='text-base font-bold'>CHÀO MỪNG BẠN ĐẾN VỚI TRUNG TÂM CỜ VUA</div>
                <div className='text-base font-bold'>PANO CHESS</div>
              </div>

              <PanoJoditEditorContent content={pageConfigData.generalIntroduction} />

              <div className='flex mt-4'>
                <Link
                  to='/gioi-thieu'
                  className='
                    text-base text-white 
                    bg-[#b45f06] hover:bg-[#c3721d] duration-200 transition 
                    px-4 py-2 rounded-full mx-auto 
                    flex items-center gap-1'
                >
                  Xem thêm
                  <ArrowRightOutlined />
                </Link>
              </div>
            </div>
          )}

          {pageConfigData.treeDiagram && (
            <div className='w-full md:w-1/2 text-center tree-diagram'>
              <Link to='/khoa-hoc' className='inline-block mx-auto'>
                <img
                  src={BASE_URLS.uploadEndPoint + pageConfigData.treeDiagram}
                  alt=''
                  width='100%'
                  height='auto'
                  className='max-w-[400px]'
                />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Outstanding images */}
      {pageConfigData.outstandingImages && pageConfigData.outstandingImages.length > 0 && (
        <div className='pano-container'>
          <InfiniteLooper speed={20}>
            <>
              {pageConfigData.outstandingImages.map((image) => (
                <PanoImage
                  key={image}
                  src={BASE_URLS.uploadEndPoint + image}
                  containerClassNames='aspect-square w-[300px]'
                  imgClassNames='object-cover aspect-square'
                />
              ))}
            </>
          </InfiniteLooper>
        </div>
      )}

      {/* Activity news */}
      {pageConfigData.activityNews &&
        getPostListByPostCategorySlugQueryOfActivityNewsSection.data &&
        getPostListByPostCategorySlugQueryOfActivityNewsSection.data.data.length > 0 && (
          <div className='pano-container flex flex-col gap-8 items-start'>
            <div className='w-full flex justify-between items-center'>
              <h2 className='pano-title'>{pageConfigData.activityNews.title}</h2>
            </div>

            <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-8'>
              {getPostListByPostCategorySlugQueryOfActivityNewsSection.data?.data && (
                <>
                  {getPostListByPostCategorySlugQueryOfActivityNewsSection.data.data.length === 0 &&
                    'Không có bài viết nào.'}

                  {getPostListByPostCategorySlugQueryOfActivityNewsSection.data.data.length > 0 &&
                    getPostListByPostCategorySlugQueryOfActivityNewsSection.data?.data?.map((post) => (
                      <Post key={post.id} post={post} />
                    ))}
                </>
              )}
            </div>

            <Link
              to={`/danh-muc-bai-viet/${pageConfigData.activityNews.postCategorySlug}`}
              className='text-base text-white bg-[#b45f06] hover:bg-[#c3721d] duration-200 transition px-4 py-2 rounded-full mx-auto flex items-center gap-1'
            >
              Xem thêm
              <ArrowRightOutlined />
            </Link>
          </div>
        )}

      {/* First information */}
      {pageConfigData.firstInformation && (
        <div className='pano-container'>
          <PanoSwiper
            slides={pageConfigData.firstInformation
              .filter((item) => item.enabled)
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <Card data={item} />
              ))}
            breakpoints={CARD_BREAK_POINTS}
          />
        </div>
      )}

      {/* Greatest games */}
      {getGreatestGamesQuery.data ? (
        <div className='pano-container'>
          <h2 className='pano-title mb-8'>Các ván đấu nổi bật</h2>
          {selectedGame && <div className=''>{htmlParse(selectedGame.embedLink)}</div>}

          <Table
            className='w-full greatest-games-table'
            columns={columns}
            dataSource={getGreatestGamesQuery.data.map((item) => ({ ...item, key: item._id }))}
            bordered
            pagination={false}
            scroll={{
              x: 100
            }}
            onRow={(record) => {
              return {
                onClick: () => setSelectedGame(record)
              }
            }}
          />
        </div>
      ) : null}

      {/* Second information */}
      <div className='pano-container'>
        {pageConfigData.secondInformation && (
          <div className='flex flex-col gap-8 items-start'>
            {pageConfigData.secondInformation
              .filter((item) => item.enabled)
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <div key={item.id} className='flex flex-col gap-8 items-start'>
                  <h2 className='pano-title'>{item.title}</h2>

                  <div className='w-full'>
                    <PanoJoditEditorContent content={item.summary} />
                  </div>

                  <Link
                    to={item.link}
                    target={item.link.startsWith('http') ? '_blank' : '_self'}
                    className='text-base text-white bg-[#b45f06] hover:bg-[#c3721d] duration-200 transition px-4 py-2 rounded-full mx-auto flex items-center gap-1'
                  >
                    Xem thêm
                    <ArrowRightOutlined />
                  </Link>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Chess news */}
      {pageConfigData.chessNews && (
        <div className='pano-container flex flex-col gap-8 items-start'>
          <div className='w-full flex justify-between items-center'>
            <h2 className='pano-title'>{pageConfigData.chessNews.title}</h2>
          </div>

          <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-8'>
            {getPostListByPostCategorySlugQueryOfChessNewsSection.data?.data && (
              <>
                {getPostListByPostCategorySlugQueryOfChessNewsSection.data.data.length === 0 &&
                  'Không có bài viết nào.'}

                {getPostListByPostCategorySlugQueryOfChessNewsSection.data.data.length > 0 &&
                  getPostListByPostCategorySlugQueryOfChessNewsSection.data?.data?.map((post) => (
                    <Post key={post.id} post={post} />
                  ))}
              </>
            )}
          </div>

          <Link
            to={`/danh-muc-bai-viet/${pageConfigData.chessNews.postCategorySlug}`}
            className='text-base text-white bg-[#b45f06] hover:bg-[#c3721d] duration-200 transition px-4 py-2 rounded-full mx-auto flex items-center gap-1'
          >
            Xem thêm
            <ArrowRightOutlined />
          </Link>
        </div>
      )}
    </div>
  ) : (
    <HomePageSkeleton />
  )
}

export default HomePage

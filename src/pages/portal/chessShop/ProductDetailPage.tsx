import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Image } from 'antd'
import clsx from 'clsx'
import { BASE_URLS } from '~/configs'
import { useGetProductBySlugQuery, useGetProductQuery } from '~/stores/server/productStore'
import SvgImage from '~/assets/images/undraw_gone_shopping_re_2lau.svg'
import { PanoImage, PanoJoditEditorContent } from '~/components'
import { ProductCard } from './components'
import './productDetailPage.scss'

const ProductDetailPage = () => {

  // title
  document.title = 'Chi tiết sản phẩm - Trung tâm cờ vua Pano Chess'

  const { slug } = useParams()

  // Stores
  const getProductQuery = useGetProductQuery({
    page: 1,
    take: 50,
    enabled: true,
    excludeSlug: slug
  })
  const getProductBySlugQuery = useGetProductBySlugQuery({
    slug
  })

  //   States
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null)

  //   Effects
  useEffect(() => {
    if (!getProductBySlugQuery.data || getProductBySlugQuery.data.images.length === 0) {
      return
    }
    setSelectedImageSrc(getProductBySlugQuery.data.images[0].image)
  }, [getProductBySlugQuery.data])

  // Template
  return (
    <div className='pano-container py-8 portal-product-detail-page'>
      <div className='flex flex-col items-stretch gap-6 lg:gap-8'>
        {getProductBySlugQuery.data ? (
          <>
            {' '}
            {/* Above */}
            <div className='grid grid-cols-1 lg:grid-cols-2 items-start gap-8'>
              {/* Product images */}
              <div className='flex flex-col sm:flex-row items-stretch lg:items-start gap-4'>
                <div className='flex flex-row flex-wrap sm:flex-col gap-2'>
                  {getProductBySlugQuery.data.images.map((image) => (
                    <div
                      key={image.id}
                      onClick={() => setSelectedImageSrc(image.image)}
                      className={clsx(
                        'w-24 border border-neutral-200 hover:border-neutral-400 transition-colors duration-200 rounded p-1 cursor-pointer',
                        image.image === selectedImageSrc ? 'border-neutral-400' : 'border-neutral-200'
                      )}
                    >
                      <PanoImage
                        src={BASE_URLS.uploadEndPoint + image.image}
                        containerClassNames='aspect-square'
                        imgClassNames='object-cover'
                      />
                      {/* <img
                      src={BASE_URLS.uploadEndPoint + image.image}
                      alt=''
                      className='w-full aspect-square object-contain'
                    /> */}
                    </div>
                  ))}
                </div>

                <div className='aspect-auto lg:aspect-square flex-1'>
                  {selectedImageSrc && (
                    <Image
                      src={BASE_URLS.uploadEndPoint + selectedImageSrc}
                      alt=''
                      preview
                      className='w-full object-contain'
                    />
                  )}
                </div>
              </div>

              {/* Product information */}
              <div className='flex flex-col gap-4 items-stretch'>
                {getProductBySlugQuery.data.name && (
                  <h1 className='text-lg sm:text-2xl md:text-4xl text-[#b45f06] font-bold'>
                    {getProductBySlugQuery.data.name}
                  </h1>
                )}

                {getProductBySlugQuery.data.description && (
                  <h2 className='text-[#525252]'>{getProductBySlugQuery.data.description}</h2>
                )}

                {getProductBySlugQuery.data.price && (
                  <h3 className='text-base sm:text-xl md:text-2xl font-bold'>
                    {`${getProductBySlugQuery.data.price} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </h3>
                )}

                <div className='hidden lg:block'>
                  <img src={SvgImage} alt='' className='w-1/2 h-auto' />
                </div>
              </div>
            </div>
            {/* Bottom */}
            <div>
              <PanoJoditEditorContent content={getProductBySlugQuery.data.content} />
            </div>
          </>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-2 items-start gap-8'>
            <div className='pano-animate-pulse h-80'></div>
            <div className='flex flex-col gap-4'>
              <div className='pano-animate-pulse h-10'></div>
              <div className='pano-animate-pulse h-10'></div>
              <div className='pano-animate-pulse h-10'></div>
            </div>
          </div>
        )}

        {/* Product list */}
        <div className='flex flex-col gap-4 items-stretch'>
          <h1 className='text-lg sm:text-2xl md:text-4xl text-[#b45f06] font-bold'>Xem thêm</h1>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            {getProductQuery.data
              ? getProductQuery.data.data.map((product) => <ProductCard key={product.id} product={product} />)
              : Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className='p-8 flex flex-col gap-4 bg-white rounded shadow-pano-1'>
                      <div className='h-32 pano-animate-pulse'></div>
                      <div className='h-6 pano-animate-pulse'></div>
                      <div className='h-10 pano-animate-pulse'></div>
                      <div className='h-6 pano-animate-pulse'></div>
                    </div>
                  ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage

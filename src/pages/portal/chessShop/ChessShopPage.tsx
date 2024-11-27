import { useGetProductQuery } from '~/stores/server/productStore'
import { ProductCard } from './components'

const ChessShop = () => {

  // Title
  document.title = 'Cửa hàng - Trung tâm cờ vua Pano Chess'

  // Stores
  const getProductQuery = useGetProductQuery({
    page: 1,
    take: 50,
    enabled: true
  })

  // Template
  return (
    <div className='pano-container py-8'>
      <h2 className='pano-title mb-8'>CÁC SẢN PHẨM CỦA PANO CHESS</h2>

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
  )
}

export default ChessShop

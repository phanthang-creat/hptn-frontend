import { FC } from 'react'
import { Link } from 'react-router-dom'
import { PanoImage } from '~/components'
import { BASE_URLS } from '~/configs'
import { GetProductResponseDataItemType } from '~/types/productType'

interface Props {
  product: GetProductResponseDataItemType
}

const ProductCard: FC<Props> = ({ product }) => {
  return (
    <Link
      key={product.id}
      to={`/san-pham/${product.slug}`}
      className='h-full p-2 bg-white cursor-pointer hover:-translate-y-1 duration-200 transition'
    >
      <div className='h-full shadow-pano-1 rounded p-8 flex flex-col gap-4'>
        <PanoImage
          src={BASE_URLS.uploadEndPoint + product.image}
          containerClassNames='rounded aspect-video overflow-hidden'
          imgClassNames='object-cover w-full'
        />
        {/* <div className='w-full rounded aspect-video'>
          <img src={BASE_URLS.uploadEndPoint + product.image} alt='' className='w-full rounded object-cover mx-auto' />
        </div> */}

        <div className='flex flex-col items-start gap-4 flex-1'>
          {product.name && <h4 className='text-base font-medium'>{product.name}</h4>}
          {product.description && <h5 className='text-[#525252]'>{product.description}</h5>}
          {product.price && <h6>{`${product.price} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h6>}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard

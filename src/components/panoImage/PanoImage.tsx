import { FC, useState } from 'react'
import clsx from 'clsx'

interface Props {
  src: string
  alt?: string
  imgClassNames?: string
  containerClassNames?: string
}

const PanoImage: FC<Props> = ({ src, alt = '', containerClassNames = '', imgClassNames = '' }) => {
  // States
  const [loaded, setLoaded] = useState<boolean>(false)

  return (
    <div className={clsx(containerClassNames, 'flex justify-center')}>
      <div className={clsx(`w-full h-full animate-pulse bg-neutral-300`, loaded ? 'hidden' : 'block')}></div>
      <img
        src={src}
        alt={alt}
        className={clsx(`${imgClassNames}`, loaded ? 'block' : 'hidden')}
        onLoad={() => {
          setLoaded(true)
        }}
      />
    </div>
  )
}

export default PanoImage

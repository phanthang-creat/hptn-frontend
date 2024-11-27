import { FC, useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

interface Props {
  speed?: number
  direction?: 'left' | 'right'
  children: React.ReactNode
}

const InfiniteLooper: FC<Props> = ({ speed = 8, direction = 'left', children }) => {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  const [looperInstances, setLooperInstances] = useState(1)
  const [isHover, setIsHover] = useState(false)

  // Methods
  const resetAnimation = () => {
    if (innerRef?.current) {
      innerRef.current.setAttribute('data-animate', 'false')

      setTimeout(() => {
        if (innerRef?.current) {
          innerRef.current.setAttribute('data-animate', 'true')
        }
      }, 10)
    }
  }

  const setupInstances = useCallback(() => {
    if (!innerRef?.current || !outerRef?.current) return

    const { width } = innerRef.current.getBoundingClientRect()

    const { width: parentWidth } = outerRef.current.getBoundingClientRect()

    const widthDeficit = parentWidth - width

    const instanceWidth = width / innerRef.current.children.length

    if (widthDeficit) {
      setLooperInstances(looperInstances + Math.ceil(widthDeficit / instanceWidth) + 1)
    }

    resetAnimation()
  }, [looperInstances])

  const onMouseMove = () => {

    // if it is mobile
    if (window.innerWidth < 768) {
      onClick()
      return
    }

    setIsHover(true)
  }

  const onClick = () => {
    // console.log('clicked')
    setIsHover(!isHover)
  }

  // Effects
  useEffect(() => setupInstances(), [setupInstances])

  useEffect(() => {
    window.addEventListener('resize', setupInstances)

    return () => {
      window.removeEventListener('resize', setupInstances)
    }
  }, [looperInstances, setupInstances])

  return (
    <div ref={outerRef} className='w-full overflow-hidden'>
      <div
        ref={innerRef}
        className='w-fit flex justify-center gap-8 group'
        data-animate='true'
        onMouseMove={() => onMouseMove()}
        onMouseLeave={() => setIsHover(false)}
        // onClick={() => setIsHover(!isHover)}
      >
        {[...Array(looperInstances)].map((_, ind) => (
          <div
            key={ind}
            className={clsx('w-max flex gap-8 animate-none group-data-[animate=true]:animate-infinite-looper')}
            style={{
              animationDuration: `${speed}s`,
              animationDirection: direction === 'right' ? 'reverse' : 'normal',
              animationPlayState: isHover ? 'paused' : 'running',
              WebkitAnimationPlayState: isHover ? 'paused' : 'running',
              MozAnimationPlayState: isHover ? 'paused' : 'running'
            }}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  )
}

export default InfiniteLooper

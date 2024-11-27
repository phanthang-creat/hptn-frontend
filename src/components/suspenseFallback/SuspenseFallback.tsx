import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const SuspenseFallback = () => {
  return (
    <div className='fixed top-0 right-0 bottom-0 left-0 bg-white'>
      <Spin
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
        indicator={<LoadingOutlined spin />}
      />
    </div>
  )
}

export default SuspenseFallback

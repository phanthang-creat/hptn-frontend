const HomePageSkeleton = () => {
  const numberOfItem = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 4

  return (
    <div className='pano-container py-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {Array(numberOfItem)
          .fill(0)
          .map((_, index) => (
            <div key={index} className='h-8 pano-animate-pulse'></div>
          ))}
      </div>

      <div className='mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
        {Array(numberOfItem)
          .fill(0)
          .map((_, index) => (
            <div key={index} className='flex p-8 flex-col gap-4 items-stretch bg-white rounded shadow-pano-1'>
              <div className='h-28 pano-animate-pulse'></div>
              <div className='h-12 pano-animate-pulse'></div>
              <div className='h-9 pano-animate-pulse'></div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default HomePageSkeleton

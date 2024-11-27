import { FC, useEffect, useState } from 'react'
import { Button } from 'antd'
import { PanoJoditEditor } from '~/components'
import { HomePageConfigDataType } from '~/types/homePageType'

interface Props {
  pageConfigData: HomePageConfigDataType | null
  loading: boolean
  onUpdatePageConfig: (config: string) => Promise<void>
}

const GeneralIntroduction: FC<Props> = ({ pageConfigData, loading, onUpdatePageConfig }) => {
  // States
  const [content, setContent] = useState<string>('')

  // Methods
  const handleSubmit = () => {
    onUpdatePageConfig(
      JSON.stringify(
        pageConfigData
          ? { ...pageConfigData, generalIntroduction: content }
          : {
              generalIntroduction: content
            }
      )
    )
  }

  // Effects
  useEffect(() => {
    if (!pageConfigData || !pageConfigData.generalIntroduction) {
      return
    }

    setContent(pageConfigData.generalIntroduction)
  }, [pageConfigData])

  return (
    <div className='flex flex-col items-start gap-4'>
      <PanoJoditEditor content={content} onChange={setContent} />

      <Button className='self-end' type='primary' onClick={handleSubmit} loading={loading}>
        Hoàn thành
      </Button>
    </div>
  )
}

export default GeneralIntroduction

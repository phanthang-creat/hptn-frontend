import { FC } from 'react'
import htmlParse from 'html-react-parser'

interface Props {
  content: string
}

const PanoJoditEditorContent: FC<Props> = ({ content = '' }) => {
  return (
    <div className='jodit-container c-jodit-container'>
      <div className='jodit-wysiwyg'>{htmlParse(content)}</div>
    </div>
  )
}

export default PanoJoditEditorContent

import { useMemo, FC, Dispatch, SetStateAction } from 'react'
import { useNavigate } from 'react-router-dom'
import JoditEditor from 'jodit-react'
import BASE_URLS from '~/configs/baseUrl'
import { UploadFileResponseDataType } from '~/types/fileUploadType'

interface Props {
  content: string
  onChange: Dispatch<SetStateAction<string>>
  readonly?: boolean
}

const PanoJoditEditor: FC<Props> = ({ content, onChange, readonly = false }) => {
  const navigate = useNavigate()

  const config = useMemo(
    () => ({
      tabIndex: 1,
      readonly, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: 'Nhập nội dung',
      language: 'en',
      height: 600,
      enter: 'p' as 'p' | 'div' | 'br' | undefined,
      direction: 'ltr' as 'rtl' | 'ltr' | '',
      defaultMode: 1, // WYSIWYG,
      defaultLineHeight: 1.5,
      inline: false,
      uploader: {
        method: 'POST',
        insertImageAsBase64URI: false,
        format: 'json',
        imagesExtensions: ['jpg', 'png', 'jpeg', 'gif', 'svg', 'webp'],
        url: `${BASE_URLS.apiEndPoint}/upload-files`,

        prepareData: (formData: FormData) => {
          // Go here to upload file
          const file = formData.getAll('files[0]')[0]
          formData.delete('files[0]')
          formData.append('files', file)
          formData.delete('path')
          formData.delete('source')
          return formData
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pano-auth')}`
        },
        error: () => {
          localStorage.removeItem('pano-auth')
          return navigate('/dashboard/login', {
            state: {
              from: window.location.pathname
            }
          })
        },
        isSuccess: (response: Array<UploadFileResponseDataType>) => {
          return Array.isArray(response) && response.length > 0
        },
        process: (response: Array<UploadFileResponseDataType>) => {
          return {
            files: [response[0].path],
            isImages: [response[0].mimetype.includes('image')],
            baseurl: BASE_URLS.uploadEndPoint,
            newfilename: response[0].filename
          }
        }
      },
      useNativeTooltip: true,
      showTooltip: true,
      showTooltipDelay: 0,
      statusbar: false,
      toolbarAdaptive: false,
      buttons:
        'bold,italic,underline,strikethrough,eraser,ul,ol,font,fontsize,paragraph,classSpan,lineHeight,superscript,subscript,file,image,video,cut,copy,paste,selectall,copyformat,hr,table,link,symbols,indent,outdent,align,brush,undo,redo,find,source,fullsize,preview,print',
      disablePlugins: 'spellcheck'
    }),
    [readonly]
  )

  return <JoditEditor value={content} config={config} onBlur={onChange} />
}

export default PanoJoditEditor

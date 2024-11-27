const BASE_URLS = {
  apiEndPoint: 'https://ptit.dtpro.click/api',
  uploadEndPoint: 'https://upload.ptit.dtpro.click'
}

if (process.env.NODE_ENV === 'production') {
  BASE_URLS.apiEndPoint = 'https://ptit.dtpro.click/api'
  BASE_URLS.uploadEndPoint = 'https://upload.ptit.dtpro.click'
}

export default BASE_URLS

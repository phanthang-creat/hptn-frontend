/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import Qs from 'qs'
import BASE_URLS from './baseUrl'

const instance = axios.create({
  baseURL: BASE_URLS.apiEndPoint,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  paramsSerializer: (params) => {
    if (typeof URLSearchParams !== 'undefined' && params instanceof URLSearchParams) {
      return params.toString()
    }
    return Qs.stringify(params, { arrayFormat: 'repeat', skipNulls: true })
  }
})

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    // if (config.url?.includes('/auth/login') || config.method === 'get') {
    //   return config
    // }

    // Set headers authorization
    const accessToken = window.localStorage.getItem('pano-auth')
    accessToken && (config.headers.Authorization = `Bearer ${accessToken}`)

    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// // Add a response interceptor
instance.interceptors.response.use(
  async (response) => {
    return response
  },
  (error: any) => {
    console.log(error)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('pano-auth')
      window.location.href = '/dashboard/login'
      return
    }
    return Promise.reject(error)
  }
)

export default instance

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@tanstack/react-query'
import { axios } from '~/configs'

// [POST] /auth/login
interface PostAuthLoginBodyData {
  username: string
  password: string
}

interface PostAuthLoginResponseData {
  accessToken: string
}

const usePostAuthLoginMutation = () => {
  return useMutation({
    mutationKey: ['[POST] /auth/login'],
    mutationFn: (data: PostAuthLoginBodyData) => axios.post<PostAuthLoginResponseData>('/auth/login', data),
    onSuccess: (data) => {
      localStorage.setItem('pano-auth', data.data.accessToken)
    }
  })
}

export { usePostAuthLoginMutation }

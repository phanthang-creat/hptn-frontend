/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@tanstack/react-query'
import { axios } from '~/configs'
import { UploadFileResponseDataType } from '~/types/fileUploadType'

// [POST] /upload-files
const usePostUploadFilesMutation = () => {
  return useMutation({
    mutationKey: ['[POST] /upload-files'],
    mutationFn: (data: FormData) =>
      axios.post<UploadFileResponseDataType[]>('/upload-files', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
  })
}

// [POST] /upload-files/cv
const usePostUploadFilesCvMutation = () => {
  return useMutation({
    mutationKey: ['[POST] /upload-files/cv'],
    mutationFn: (data: FormData) =>
      axios.post<UploadFileResponseDataType>('/upload-files/cv', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
  })
}

export { usePostUploadFilesMutation, usePostUploadFilesCvMutation }

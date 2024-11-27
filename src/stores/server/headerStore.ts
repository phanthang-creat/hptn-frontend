import { useQuery, keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query'
import { axios } from '~/configs'
import { PanoHeaderDataType } from '~/types/headerType'

// [GET] /headers
interface GetHeaderQueryResponseDataType {
  _id: string
  __v: number
  createdAt: string
  updatedAt: string
  data?: PanoHeaderDataType
}

const useGetHeadersQuery = () => {
  return useQuery({
    queryKey: ['[GET] /headers'],
    queryFn: () => axios.get<GetHeaderQueryResponseDataType>('/headers'),
    placeholderData: keepPreviousData,
    retry: 3,
    select: (data) => data.data.data
  })
}

// [PATCH] /headers
const usePatchHeadersMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['[PATCH] /headers'],
    mutationFn: (data: string) => axios.patch<GetHeaderQueryResponseDataType>('/headers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getHeaderQuery'] })
    }
  })
}

export { useGetHeadersQuery, usePatchHeadersMutation }

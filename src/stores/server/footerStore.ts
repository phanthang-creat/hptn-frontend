import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '~/configs'
import { PanoFooterSectionDataType } from '~/types/footerType'

// [GET] /footers
interface GetFooterQueryResponseDataType {
  _id: string
  __v: number
  createdAt: string
  updatedAt: string
  data?: Array<PanoFooterSectionDataType>
}

const useGetFootersQuery = () => {
  return useQuery({
    queryKey: ['[GET] /footers'],
    queryFn: () => axios.get<GetFooterQueryResponseDataType>('/footers'),
    placeholderData: keepPreviousData,
    retry: 3,
    select: (data) => data.data.data
  })
}

// [PATCH] /footers
const usePatchFootersMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['[PATCH] /footers'],
    mutationFn: (data: string) => axios.patch('/footers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['[GET] /footers'] })
    }
  })
}

export { useGetFootersQuery, usePatchFootersMutation }

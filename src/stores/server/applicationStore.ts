import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '~/configs'
import {
  GetApplicationQueryResponseDataType,
  PatchApplicationRequestBodyType,
  PostApplicationRequestBodyType
} from '~/types/applicationType'

// [GET] /application
const useGetApplicationQuery = ({
  order = 'DESC',
  page = 1,
  take = 10,
  recruitmentId,
  fullName,
  email
}: {
  order?: 'ASC' | 'DESC'
  page?: number
  take?: number
  recruitmentId?: string
  fullName?: string
  email?: string
}) => {
  return useQuery({
    queryKey: ['[GET] /application', order, page, take, recruitmentId, fullName, email],
    queryFn: () =>
      axios.get<GetApplicationQueryResponseDataType>(
        `/application?order=${order}&page=${page}&take=${take}${
          recruitmentId ? `&recruitmentId=${recruitmentId}` : ''
        }${fullName ? `&fullName=${fullName}` : ''}${email ? `&email=${email}` : ''}`
      ),
    select: (data) => data.data
  })
}

// [POST] /application
const usePostApplicationMutation = () => {
  return useMutation({
    mutationKey: ['[POST] /application'],
    mutationFn: (requestBody: PostApplicationRequestBodyType) => axios.post('/application', requestBody)
  })
}

// [PATCH] /application/{id}
const usePatchApplicationMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['[PATCH] /application/{id}'],
    mutationFn: ({ id, requestBody }: { id: string; requestBody: PatchApplicationRequestBodyType }) =>
      axios.patch(`/application/${id}`, requestBody),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['[GET] /application', 'DESC', 1, 10]
      })
  })
}

// [DELETE] /application/{id}
const useDeleteApplicationByIdMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['[DELETE] /application/{id}'],
    mutationFn: (id: string) => axios.delete(`/application/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['[GET] /application', 'DESC', 1, 10]
      })
  })
}

export {
  useGetApplicationQuery,
  usePostApplicationMutation,
  useDeleteApplicationByIdMutation,
  usePatchApplicationMutation
}

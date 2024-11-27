import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '~/configs'

// [GET] /page
type GetPageQueryResponseDataType = Array<{ _id: string; code: string; link: string; name: string }>

const useGetPageQuery = () => {
  return useQuery({
    queryKey: ['[GET] /page'],
    queryFn: () => axios.get<GetPageQueryResponseDataType>('/page'),
    retry: 3,
    select: (data) => data.data
  })
}

// [GET] /page/{code}
interface GetPageByCodeQueryResponseDataType {
  _id: string
  name: string
  code: string
  link: string
  config: string
  createdAt: string
  updatedAt: string
}

const useGetPageByCodeQuery = (options: { code: string }) => {
  return useQuery({
    queryKey: ['[GET] /page/{code}', options.code],
    queryFn: () => axios.get<GetPageByCodeQueryResponseDataType>(`/page/${options.code}`),
    enabled: !!options.code,
    retry: 3,
    select: (data) => data.data
  })
}

// [POST] /page
type PostPageMutationDataType = { name: string; code: string; link: string }

const usePostPageMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['[POST] /page'],
    mutationFn: (data: PostPageMutationDataType) => axios.post('/page', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['[GET] /page'] })
  })
}

// [PATCH] /page/{id} -> update information
interface PatchPageByIdParams {
  id: string
  data: { name: string; code: string; link: string }
}

const usePatchPageInfoByIdMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['[PATCH] /page/{id}/info'],
    mutationFn: (params: PatchPageByIdParams) => axios.patch(`/page/${params.id}`, params.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['[GET] /page'] })
  })
}

// [PATCH] /page/{id} -> update config
const usePatchPageConfigByIdMutation = (options: { code: string }) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['[PATCH] /page/{id}/config'],
    mutationFn: (params: { id: string; config: string }) =>
      axios.patch(`/page/${params.id}`, {
        config: params.config
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['[GET] /page/{code}', options.code]
      })
  })
}

// [DELETE] /page/{id}
const useDeletePageByIdMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['[DELETE] /page/{id}'],
    mutationFn: (id: string) => axios.delete(`/page/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['[GET] /page'] })
  })
}

export {
  useGetPageQuery,
  useGetPageByCodeQuery,
  usePostPageMutation,
  usePatchPageInfoByIdMutation,
  usePatchPageConfigByIdMutation,
  useDeletePageByIdMutation
}

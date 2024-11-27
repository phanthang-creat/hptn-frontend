import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '~/configs'
import { GetPostCategoryItemResponseDataType, PostPostCategoryRequestBodyType } from '~/types/postCategoryType'

// [GET] /post-category

const useGetPostCategoryQuery = () => {
  return useQuery({
    queryKey: ['[GET] /post-category'],
    queryFn: () => axios.get<Array<GetPostCategoryItemResponseDataType>>('/post-category'),
    select: (data) => data.data
  })
}

// [GET] /post-category/{id}
const useGetPostCategoryByIdQuery = (options: { id?: string | null }) => {
  return useQuery({
    queryKey: ['[GET] /post-category/{id}', options.id],
    queryFn: () => axios.get<GetPostCategoryItemResponseDataType>(`/post-category/${options.id}`),
    select: (data) => data.data,
    enabled: !!options.id
  })
}

// [GET] /post-category/slug/{slug}
const useGetPostCategoryBySlugQuery = (options: { slug?: string }) => {
  return useQuery({
    queryKey: ['[GET] /post-category/{id}', options.slug],
    queryFn: () => axios.get<GetPostCategoryItemResponseDataType>(`/post-category/slug/${options.slug}`),
    select: (data) => data.data,
    enabled: !!options.slug
  })
}

// [POST] /post-category
const usePostPostCategoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['[POST] /post-category'],
    mutationFn: (requestBody: PostPostCategoryRequestBodyType) => axios.post('/post-category', requestBody),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['[GET] /post-category']
      })
  })
}

// [PATCH] /post-category/{id}
const usePatchPostCategoryByIdMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['[PATCH] /post-category/{id}'],
    mutationFn: ({ id, requestBody }: { id: string; requestBody: PostPostCategoryRequestBodyType }) =>
      axios.patch(`/post-category/${id}`, requestBody),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['[GET] /post-category']
      })
  })
}

// [DELETE] /post-category/{id}
const useDeletePostCategoryByIdMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['[DELETE] /post-category/{id}'],
    mutationFn: (id: string) => axios.delete(`/post-category/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['[GET] /post-category']
      })
  })
}

export {
  useGetPostCategoryQuery,
  useGetPostCategoryByIdQuery,
  useGetPostCategoryBySlugQuery,
  usePostPostCategoryMutation,
  usePatchPostCategoryByIdMutation,
  useDeletePostCategoryByIdMutation
}

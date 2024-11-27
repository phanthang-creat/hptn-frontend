import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '~/configs'
import {
  GetPostByIdQueryResponseDataType,
  GetPostQueryItemResponseDataType,
  PostPostRequestBodyType
} from '~/types/postType'

// [GET] /post
interface GetPostQueryResponseDataType {
  data: Array<GetPostQueryItemResponseDataType>
  meta: {
    page: number
    take: number
    itemCount: number
    pageCount: number
    hasPreviousPage: boolean
    hasNextPage: boolean
  }
}

const useGetPostQuery = ({
  page = 1,
  take = 10,
  order = 'DESC',
  enabled,
  excludeSlug
}: {
  page?: number
  take?: number
  order?: string
  enabled?: boolean
  excludeSlug?: string
}) => {
  return useQuery({
    queryKey: ['[GET] /post', page, take, order, enabled, excludeSlug],
    queryFn: () =>
      axios.get<GetPostQueryResponseDataType>(
        `/post?page=${page}&take=${take}&order=${order}${typeof enabled === 'boolean' ? `&enabled=${enabled}` : ''}${
          excludeSlug ? `&excludeSlug=${excludeSlug}` : ''
        }`
      ),
    select: (data) => data.data,
    retry: 3
  })
}

// [GET] /post/post-category/{slug}
const useGetPostListByPostCategorySlugQuery = ({
  postCategorySlug,
  order = 'DESC',
  page = 1,
  take = 10,
  enabled = true,
  excludeSlug,
  title,
  minDate,
  maxDate
}: {
  postCategorySlug?: string
  order?: string
  page?: number
  take?: number
  enabled?: boolean
  excludeSlug?: string
  title?: string
  minDate?: string
  maxDate?: string
}) => {
  return useQuery({
    queryKey: [
      '[GET] /post/post-category/${options.slug}',
      postCategorySlug,
      page,
      take,
      order,
      enabled,
      excludeSlug,
      title,
      minDate,
      maxDate
    ],
    queryFn: () =>
      axios.get<GetPostQueryResponseDataType>(
        `/post/post-category/${postCategorySlug}?order=${order}&page=${page}&take=${take}&enabled=${enabled}${
          excludeSlug ? `&excludeSlug=${excludeSlug}` : ''
        }${title ? `&title=${title}` : ''}${minDate ? `&minDate=${minDate}` : ''}${
          maxDate ? `&maxDate=${maxDate}` : ''
        }`
      ),
    select: (data) => data.data,
    enabled: !!postCategorySlug,
    retry: 3
  })
}

// [GET] /post/slug/{slug}
const useGetPostBySlugQuery = (options: { slug?: string }) => {
  return useQuery({
    queryKey: ['[GET] /post/slug/{slug}', options.slug],
    queryFn: () => axios.get<GetPostByIdQueryResponseDataType>(`/post/slug/${options.slug}`),
    select: (data) => data.data,
    enabled: !!options.slug,
    retry: 3
  })
}

// [GET] /post/id/{id}
const useGetPostByIdQuery = (options: { id?: string }) => {
  return useQuery({
    queryKey: ['[GET] /post/id/{id}', options.id],
    queryFn: () => axios.get<GetPostByIdQueryResponseDataType>(`/post/id/${options.id}`),
    select: (data) => data.data,
    enabled: !!options.id,
    retry: 3
  })
}

// [GET] /post/{id} -> many
const useGetPostByIdQueries = (postIds: string[]) => {
  return useQueries({
    queries: postIds.map((postId) => ({
      queryKey: ['[GET] /post/{id}', postId],
      queryFn: () => axios.get<GetPostByIdQueryResponseDataType>(`/post/${postId}`)
    }))
  })
}

// [POST] /post
const usePostPostMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['[POST] /post'],
    mutationFn: (requestBody: PostPostRequestBodyType) => axios.post('/post', requestBody),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['[GET] /post', 1, 10, 'DESC']
      })
  })
}

// [PATCH] /post/{id}
const usePatchPostMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['[PATCH] /post/{id}'],
    mutationFn: ({ id, requestBody }: { id: string; requestBody: PostPostRequestBodyType }) =>
      axios.patch(`/post/${id}`, requestBody),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['[GET] /post', 1, 10, 'DESC']
      })
  })
}

// [DELETE] /post/{id}
const useDeletePostMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['[DELETE] /post/{id}'],
    mutationFn: (id: string) => axios.delete(`/post/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['[GET] /post', 1, 10, 'DESC']
      })
  })
}

export {
  useGetPostQuery,
  useGetPostListByPostCategorySlugQuery,
  useGetPostBySlugQuery,
  useGetPostByIdQuery,
  useGetPostByIdQueries,
  usePostPostMutation,
  usePatchPostMutation,
  useDeletePostMutation
}

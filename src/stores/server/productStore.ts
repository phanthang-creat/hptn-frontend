import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '~/configs'
import {
  PostProductRequestBodyType,
  GetProductResponseDataType,
  GetProductByIdResponseDataType
} from '~/types/productType'

// [GET] /product
const useGetProductQuery = ({
  order = 'DESC',
  page = 1,
  take = 10,
  enabled,
  excludeSlug
}: {
  order?: 'ASC' | 'DESC'
  page?: number
  take?: number
  enabled?: boolean
  excludeSlug?: string
}) => {
  return useQuery({
    queryKey: ['[GET] /product', order, page, take, enabled],
    queryFn: () =>
      axios.get<GetProductResponseDataType>(
        `/product?page=${page}&take=${take}&order=${order}${typeof enabled === 'boolean' ? `&enabled=${enabled}` : ''}${
          excludeSlug ? `&excludeSlug=${excludeSlug}` : ''
        }`
      ),
    select: (data) => data.data
  })
}

// [GET] /product/slug/{slug}
const useGetProductBySlugQuery = ({ slug }: { slug?: string }) => {
  return useQuery({
    queryKey: ['[GET] /product/slug/{slug}', slug],
    queryFn: () => axios.get<GetProductByIdResponseDataType>(`/product/slug/${slug}`),
    enabled: Boolean(slug),
    select: (data) => data.data
  })
}

// [GET] /product/{id}
const useGetProductByIdQuery = ({ id }: { id?: string }) => {
  return useQuery({
    queryKey: ['[GET] /product/{id}', id],
    queryFn: () => axios.get<GetProductByIdResponseDataType>(`/product/${id}`),
    enabled: Boolean(id),
    select: (data) => data.data
  })
}

// [POST] /product
const usePostProductMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['[POST] /product'],
    mutationFn: (requestBody: PostProductRequestBodyType) => axios.post('/product', requestBody),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['[GET] /product', 'DESC', 1, 10]
      })
  })
}

// [PATCH] /product/{id}
const usePatchProductMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['[PATCH] /product'],
    mutationFn: ({ id, requestBody }: { id: string; requestBody: PostProductRequestBodyType }) =>
      axios.patch(`/product/${id}`, requestBody),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['[GET] /product', 'DESC', 1, 10]
      })
  })
}

// [DELETE] /product/{id}
const useDeleteProductMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['[DELETE] /product'],
    mutationFn: (id: string) => axios.delete(`/product/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['[GET] /product', 'DESC', 1, 10]
      })
  })
}

export {
  useGetProductQuery,
  useGetProductBySlugQuery,
  useGetProductByIdQuery,
  usePostProductMutation,
  usePatchProductMutation,
  useDeleteProductMutation
}

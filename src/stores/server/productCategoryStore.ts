import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '~/configs'
import { GetProductCategoryResponseDataType, PostProductCategoryRequestBodyType } from '~/types/productCategoryType'

// [GET] /product-category
const useGetProductCategoryQuery = () => {
  return useQuery({
    queryKey: ['[GET] /product-category'],
    queryFn: () => axios.get<GetProductCategoryResponseDataType[]>('/product-category'),
    select: (data) => data.data
  })
}

// [GET] /product-category/{id}
const useGetProductCategoryByIdQuery = ({ id }: { id?: string }) => {
  return useQuery({
    queryKey: ['[GET] /product-category/{id}', id],
    queryFn: () => axios.get<GetProductCategoryResponseDataType>(`/product-category/${id}`),
    enabled: Boolean(id),
    select: (data) => data.data
  })
}

// [GET] /product-category/slug/{slug}
const useGetProductCategoryBySlugQuery = ({ slug }: { slug?: string }) => {
  return useQuery({
    queryKey: ['[GET] /product-category/slug/{slug}', slug],
    queryFn: () => axios.get<GetProductCategoryResponseDataType>(`/product-category/slug/${slug}`),
    enabled: Boolean(slug),
    select: (data) => data.data
  })
}

// [POST] /product-category
const usePostProductCategoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['[POST] /product-category'],
    mutationFn: (requestBody: PostProductCategoryRequestBodyType) => axios.post('/product-category', requestBody),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['[GET] /product-category']
      })
  })
}

// [PATCH] /product-category/{id}
const usePatchProductCategoryByIdMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['[PATCH] /product-category/{id}'],
    mutationFn: ({ id, requestBody }: { id: string; requestBody: PostProductCategoryRequestBodyType }) =>
      axios.patch(`/product-category/${id}`, requestBody),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['[GET] /product-category']
      })
  })
}

// [DELETE] /product-category/{id}
const useDeleteProductCategoryByIdMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['[DELETE] /product-category/{id}'],
    mutationFn: (id: string) => axios.delete(`/product-category/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['[GET] /product-category']
      })
  })
}

export {
  useGetProductCategoryQuery,
  useGetProductCategoryByIdQuery,
  useGetProductCategoryBySlugQuery,
  usePostProductCategoryMutation,
  usePatchProductCategoryByIdMutation,
  useDeleteProductCategoryByIdMutation
}

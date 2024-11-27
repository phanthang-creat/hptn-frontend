import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '~/configs'
import {
  GetRecruitmentByIdResponseDataType,
  GetRecruitmentResponseDataType,
  PostRecruitmentRequestBodyType
} from '~/types/recruitmentType'

// [GET] /recruitment
const useGetRecruitmentQuery = ({
  order = 'DESC',
  page = 1,
  take = 10,
  title,
  enabled,
  recruitmentTypeId,
  recruitmentPositionId,
  address,
  excludeSlug
}: {
  order?: string
  page?: number
  take?: number
  title?: string
  enabled?: boolean
  recruitmentTypeId?: number
  recruitmentPositionId?: number
  address?: string
  excludeSlug?: string
}) => {
  return useQuery({
    queryKey: [
      '[GET] /recruitment',
      order,
      page,
      take,
      title,
      enabled,
      recruitmentTypeId,
      recruitmentPositionId,
      address,
      excludeSlug
    ],
    queryFn: () =>
      axios.get<GetRecruitmentResponseDataType>(
        `/recruitment?order=${order}&page=${page}&take=${take}${
          typeof enabled === 'boolean' ? `&enabled=${enabled}` : ''
        }${excludeSlug ? `&excludeSlug=${excludeSlug}` : ''}${title ? `&title=${title}` : ''}${
          recruitmentTypeId ? `&recruitmentTypeId=${recruitmentTypeId}` : ''
        }${recruitmentPositionId ? `&recruitmentPositionId=${recruitmentPositionId}` : ''}${
          address ? `&address=${address}` : ''
        }`
      ),
    select: (data) => data.data,
    retry: 3
  })
}

// [GET] /recruitment/{id}
const useGetRecruitmentByIdQuery = ({ id }: { id?: string }) => {
  return useQuery({
    queryKey: ['[GET] /recruitment/{id}', id],
    queryFn: () => axios.get<GetRecruitmentByIdResponseDataType>(`/recruitment/${id}`),
    select: (data) => data.data,
    retry: 3,
    enabled: !!id
  })
}

// [GET] /recruitment/slug/{slug}
const useGetRecruitmentBySlugQuery = ({ slug }: { slug?: string }) => {
  return useQuery({
    queryKey: ['[GET] /recruitment/slug/{slug}', slug],
    queryFn: () => axios.get<GetRecruitmentByIdResponseDataType>(`/recruitment/slug/${slug}`),
    select: (data) => data.data,
    retry: 3,
    enabled: !!slug
  })
}

// [POST] /recruitment
const usePostRecruitmentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['[POST] /recruitment'],
    mutationFn: (requestBody: PostRecruitmentRequestBodyType) => axios.post('/recruitment', requestBody),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['[GET] /recruitment']
      })
  })
}

// [PATCH] /recruitment/{id}
const usePatchRecruitmentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['[PATCH] /recruitment/{id}'],
    mutationFn: ({ id, requestBody }: { id: string; requestBody: PostRecruitmentRequestBodyType }) =>
      axios.patch(`/recruitment/${id}`, requestBody),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['[GET] /recruitment']
      })
  })
}

// [DELETE] /recruitment/{id}
const useDeleteRecruitmentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['[DELETE] /recruitment/{id}'],
    mutationFn: (id: string) => axios.delete(`/recruitment/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['[GET] /recruitment']
      })
  })
}

export {
  useGetRecruitmentQuery,
  useGetRecruitmentByIdQuery,
  useGetRecruitmentBySlugQuery,
  usePostRecruitmentMutation,
  usePatchRecruitmentMutation,
  useDeleteRecruitmentMutation
}

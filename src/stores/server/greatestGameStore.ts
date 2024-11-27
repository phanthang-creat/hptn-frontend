import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '~/configs'
import { GetGreatestGamesQueryResponseDataItemType, PostGreatestGamesRequestBodyType } from '~/types/greatestGameType'

// [GET] /greatest-games
const useGetGreatestGamesQuery = () => {
  return useQuery({
    queryKey: ['[GET] /greatest-games'],
    queryFn: () => axios.get<GetGreatestGamesQueryResponseDataItemType[]>('/greatest-games'),
    select: (data) => data.data
  })
}

// [POST] /greatest-games
const usePostGreatestGamesMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['[POST] /greatest-games'],
    mutationFn: (requestBody: PostGreatestGamesRequestBodyType) => axios.post('/greatest-games', requestBody),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['[GET] /greatest-games']
      })
  })
}

// [PATCH] /greatest-games/{id}
const usePatchGreatestGamesMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['[PATCH] /greatest-games/{id}'],
    mutationFn: ({ id, requestBody }: { id: string; requestBody: PostGreatestGamesRequestBodyType }) =>
      axios.patch(`/greatest-games/${id}`, requestBody),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['[GET] /greatest-games']
      })
  })
}

// [DELETE] /greatest-games/{id}
const useDeleteGreatestGamesMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['[DELETE] /greatest-games/{id}'],
    mutationFn: (id: string) => axios.delete(`/greatest-games/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['[GET] /greatest-games']
      })
  })
}

export {
  useGetGreatestGamesQuery,
  usePostGreatestGamesMutation,
  usePatchGreatestGamesMutation,
  useDeleteGreatestGamesMutation
}

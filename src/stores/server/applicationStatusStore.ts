import { useQuery } from '@tanstack/react-query'
import { axios } from '~/configs'

// [GET] /application-status
const useGetApplicationStatusQuery = () => {
  return useQuery({
    queryKey: ['[GET] /application-status'],
    queryFn: () =>
      axios.get<
        Array<{
          id: string
          name: string
        }>
      >('/application-status'),
    select: (data) => data.data
  })
}

export { useGetApplicationStatusQuery }

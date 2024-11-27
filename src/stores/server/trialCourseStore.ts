import { useQuery } from '@tanstack/react-query'
import { axios } from '~/configs'

// [GET] /trial-course
const useGetTrialCourseQuery = () => {
  return useQuery({
    queryKey: ['[GET] /trial-course'],
    queryFn: () =>
      axios.get<
        Array<{
          id: string
          name: string
        }>
      >('/trial-course'),
    select: (data) => data.data
  })
}

export { useGetTrialCourseQuery }

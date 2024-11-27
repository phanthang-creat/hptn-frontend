import { useQuery } from '@tanstack/react-query'
import { axios } from '~/configs'
import { RecruitmentTypeType } from '~/types/recruitmentTypeType'

// [GET] /recruitment-type
const useGetRecruitmentTypeQuery = () => {
  return useQuery({
    queryKey: ['[GET] /recruitment-type'],
    queryFn: () => axios.get<RecruitmentTypeType[]>('/recruitment-type'),
    retry: 3,
    select: (data) => data.data
  })
}

export { useGetRecruitmentTypeQuery }

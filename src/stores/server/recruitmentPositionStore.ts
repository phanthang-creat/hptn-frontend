import { useQuery } from '@tanstack/react-query'
import { axios } from '~/configs'
import { RecruitmentPositionType } from '~/types/recruitmentPositionType'

// [GET] /recruitment-position
const useGetRecruitmentPositionQuery = () => {
  return useQuery({
    queryKey: ['[GET] /recruitment-position'],
    queryFn: () => axios.get<RecruitmentPositionType[]>('/recruitment-position'),
    retry: 3,
    select: (data) => data.data
  })
}

export { useGetRecruitmentPositionQuery }

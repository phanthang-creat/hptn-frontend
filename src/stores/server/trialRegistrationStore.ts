import { useMutation } from '@tanstack/react-query'
import { axios } from '~/configs'
import { PostTrialRegistrationRequestBodyType } from '~/types/trialRegistrationType'

// [POST] /trial-registraion
const usePostTrialRegistrationMutation = () => {
  return useMutation({
    mutationKey: ['[POST] /trial-registraion'],
    mutationFn: (requestBody: PostTrialRegistrationRequestBodyType) => axios.post('/trial-registraion', requestBody)
  })
}

export { usePostTrialRegistrationMutation }

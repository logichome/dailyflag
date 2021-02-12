import {requestJson} from '@/utils/request'

export const getHerbMedicine = () => {
  return requestJson({
    url: 'https://dailyflag.oss-cn-hangzhou.aliyuncs.com/base/HERBAL_MEDICINE.json'
  })
}
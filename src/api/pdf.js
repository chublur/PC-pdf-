import request from '@/utils/request'

export function getPdfFile(params) {
  return request({
    url: '/pdf/download', // 替换为实际的PDF接口地址
    method: 'get',
    params,
    responseType: 'arraybuffer'
  })
} 
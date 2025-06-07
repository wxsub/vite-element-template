import { MockMethod } from 'vite-plugin-mock'
import { v4 as uuidV4 } from 'uuid'

export default [
  {
    url: '/api/form/banks',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '获取成功',
        data: [
            { bankName: '华夏银行宁国路支行', bankid: 1 },
            { bankName: '中国银行宁国路支行', bankid: 2 },
            { bankName: '花旗银行宁国路支行', bankid: 3 },
            { bankName: '工商银行宁国路支行', bankid: 4 }
        ]
      }
    }
  }
] as MockMethod[]
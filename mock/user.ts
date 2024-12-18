import { MockMethod } from 'vite-plugin-mock'
import { v4 as uuidV4 } from 'uuid'

export default [
  {
    url: '/api/user/info',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '获取成功',
        data: {
          id: 1,
          role: 28,
          token: uuidV4(),
          name: '张三',
          email: 'zhangsan@example.com'
        }
      }
    }
  },
  {
    url: '/api/login',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '获取成功',
        data: {
          id: 1,
          token: uuidV4(),
          name: '张三',
          email: 'zhangsan@example.com'
        }
      }
    }
  }
] as MockMethod[]

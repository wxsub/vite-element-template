import { MockMethod } from 'vite-plugin-mock'
import { v4 as uuidV4 } from 'uuid'

const menus = [
  {
    "id": 8,
    "name": "系统设置",
    "path": "setting",
    "icon": null,
    "children": [
      {
        "id": 9,
        "name": "菜单管理",
        "path": "/setting/menus",
        "icon": null,
        "children": []
      },
      {
        "id": 11,
        "name": "角色管理",
        "path": "/setting/role",
        "icon": null,
        "children": []
      },
      {
        "id": 12,
        "name": "用户管理",
        "path": "/setting/users",
        "icon": null,
        "children": []
      }
    ]
  },
  {
    "id": 13,
    "name": "组件演示",
    "path": "example",
    "icon": null,
    "children": [
      {
        "id": 9,
        "name": "FormKit组件",
        "path": "/example/formkit",
        "icon": null,
        "children": []
      }
    ]
  },
]

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
          avatar: 'https://meichuangyx-test.oss-cn-hangzhou.aliyuncs.com/ADMIN/bdb3da5c-b6a8-42c2-82ea-8e9ef32ab78b.png',
          name: '张三',
          menus,
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

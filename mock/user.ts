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
        "parentId": 8,
        "children": []
      },
      {
        "id": 11,
        "name": "角色管理",
        "path": "/setting/role",
        "icon": null,
        "parentId": 8,
        "children": []
      },
      {
        "id": 12,
        "name": "用户管理",
        "path": "/setting/users",
        "icon": null,
        "parentId": 8,
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
        "parentId": 13,
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
  },
  {
    url: '/api/user/menus',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '获取成功',
        data: menus
      }
    }
  },
  {
    url: '/api/user/searchMenu',
    method: 'get',
    response: (xhr: any) => {
      const { id } = xhr.query || {}
      const result = findMenuRow(Number(id))
      return {
        code: 200,
        message: '获取成功',
        data: result || {}
      }
    }
  },
  {
    url: '/api/user/roles',
    method: 'get',
    response: (xhr: any) => {
      return {
        code: 200,
        message: '获取成功',
        data: {
          total: 2,
          items: [
            {
              id: 1,
              name: '超级管理员',
              description: '拥有所有权限',
              menus: menus.map(menu => menu.id)
            },
            {
              id: 2,
              name: '普通用户',
              description: '只能访问公共资源',
              menus: [8, 13]
            }
          ]
        }
      }
    }
  },
  {
    url: '/api/user/users',
    method: 'get',
    response: (xhr: any) => {
      return {
        code: 200,
        message: '获取成功',
        data: {
          total: 2,
          items: [
            {
              id: 1,
              avatar: '',
              name: '超级管理员',
              accountNo: 'admin',
              email: 'google@123.com',
              state: 'NORMAL',
              description: '拥有所有权限'
            },
            {
              id: 2,
              avatar: 'https://meichuangyx-test.oss-cn-hangzhou.aliyuncs.com/ADMIN/bdb3da5c-b6a8-42c2-82ea-8e9ef32ab78b.png',
              name: '张三',
              accountNo: 'zhangsan',
              email: 'zhangsan@123.com',
              state: 'NORMAL',
              description: '拥有所有权限'
            }
          ]
        }
      }
    }
  }
] as MockMethod[]

function findMenuRow(id: number) {
  const traverse = (nodes: any): any => {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const found = traverse(node.children);
        if (found) return found;
      }
    }
    return null;
  }
  return traverse(menus);
}
# vite-element-template webapp ng page

```
npm install -g pnpm
// check you pnpm pnpm -v

// 开发启动
pnpm install
pnpm run dev

// 打包
pnpm run build
```

## Docker方式开发启动
1. [安装docker](https://www.docker.com)
2. 构建并启动容器
```
docker-compose up --build -d
```
3. 进入容器启动服务
```
docker-compose exec webapp-page /bin/bash

pnpm install
pnpm run dev
```

[演示地址](https://wxsub.github.io/vite-element-template/)

## tailwindcss
系统内置tailwindcss，tailwindcss是一个非常优秀的css辅助脚本，配合vue3动态引入的设计，so 大部分css不必动手绘制，特殊需求样式的处理，请在src/assets/styles/下查阅是否存在
类似css模块，如果没有相应css模块，你可能需要手动在style标签进行书写，当然它也是很少一部分也不推荐，推荐快速书写css参考
[tailwindcss文档](https://tailwindcss.com/docs/)，配合editor的自动提示，你将会得到令人惊奇的开发故事。
当然使用你的VSCode插件配合是个不错的选择【插件-搜索并安装tailwindcss】
*vscode没有智能的提示？*
```json
{
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

## global plugin
U can set plugin in dir("config/plugin.ts")
### How to use global plugin
eg: `this.$loadsh`, 这样的语法在任何组件的 methods 或 lifecycle hooks中都是可行的, but What you need to pay attention to is `<script setup>`, to use `getCurrentInstance()`
在插件的配置中你可以直接调用plugin方法取使用
```vue
<script setup lang="ts">
import { plugin } from "@/config/plugin"
const lodash = plugin('$lodash')
lodash.isEmpty()
</script>
```

## 应用组件
系统内应用组件尽可能放入src/components文件夹内，这个文件夹内的所有.vue文件系统内将自动import，你无需担心扫描成本，因为它依旧是按需加载的，你只需在业务内使用对应的文件名去
加载你的业务组件

Tips：需要注意系统仅扫描components文件夹内的.vue文件，并不会components内子文件夹文件创建索引

## Pages File Router and Layout System
系统会扫描pages文件目录下所有`.vue`文件以生成路由系统所以你需要使用统一规范和特定的方式去设计你的页面，路由元信息需要使用yaml语法写进route标签内，如下：
```html
<route lang="yaml">
  meta:
    layout: "default"
    title: "C"
</route>

// or

<route>
  {
    meta: { title: "A", roles: [] }
  }
</route>
```
对于路由的name字段，你不需要刻意去添加，系统会自动去生成，当然你即使添加了系统也不会采用

这种写法在编辑器中可能会存在无法高亮显示，很难看，所以必要时通过以下步骤去设置你的Vetur
update setting
```json
"vetur.grammar.customBlocks": {
  "route": "json"
}
```
Run the command in vscode
```
Vetur: Generate grammar from vetur.grammar.customBlocks
```
重新启动 VS Code 以获得自定义块的语法突出显示。

Layout System使用一个将layout混入路由的一个设计，对于非常规layout你要在系统内Layouts目录内去设计你的layout，当然设计layout时你需要避免中文文件名的产生，
因为它依旧使用文件名作为key
```vue
// 指定blank作为layout
<route>
  {
    meta: { title: "B", roles: [], layout: "blank" }
  }
</route>
```
Tips：layout字段指向的就是Layouts文件夹内所有.vue文件(默认default)你需要和文件名相同，因为者会导致路由生成失败

### 嵌套路由
可以利用 Vue Router 子路由来创建嵌套布局。可以通过为父组件定义与包含子路由的目录相同的名称来定义父组件。 当有如下的目录结构时：

```
src/pages/
  ├── users/
  │  ├── [id].vue
  │  └── index.vue
  └── users.vue
```

将会得到如下的路由配置：

```
[
  {
    path: '/users',
    component: '/src/pages/users.vue',
    children: [
      {
        path: '',
        component: '/src/pages/users/index.vue',
        name: 'users'
      },
      {
        path: ':id',
        component: '/src/pages/users/[id].vue',
        name: 'users-id'
      }
    ]
  }
]
```


### 捕获所有路由
捕获所有路由使用包含省略号的方括号来表示：
```
src/pages/[...all].vue -> /* (/non-existent-page)
```
省略号后的文字将用于命名路由，以及用作传递路由参数的属性名称。

### 正常合法使用
```
├── [...all].vue # 捕获所有路由，常用于404
├── about
│   └── index.vue
├── about.vue # 通过/about来访问该页面
├── blog  # 通过/blog来访问
│   ├── [id].vue # 动态路由
│   ├── index.vue
│   └── today
├── components.vue
└── index.vue # 当访问本地IP和端口号时的默认页面
```
虽然系统会扫描所有pages目录下的`.vue`文件，当然会将component目录过滤，因此你不必当心它们会被扫描进去路由系统。
尽管如此通常不建议将你的components文件写入pages目录内

你还需要注意：避免使用特殊符号在pages目录下新建文件或文件夹，特别是”-“，这会导致路由递归失败程序终止

### 捕获路由权限
需要的路由信息以及权限资源将统一来自/config/router.permission.js, 你可以导出其permission方法，加载系统的全部数据将存放于此

## About use to elementUi icons
All icons has been imported into the system when execute main.js, like this

```html
<el-icon><Lock /></el-icon>
```
避免重复导入Lock图标组件进入系统


# vite-element-template webapp

**中文** | [English](./README.md)

基于vue3+vite+elementPlus的一个快速前端后台框架搭建项目，项目集成自动化发布方案、elementUI动态组件导入、axios、mockjs以及docker等。

**项目node版本不低于18.0.0**

## 项目结构

```
├── .github/                # GitHub工作流配置
├── deploy/                 # 部署脚本和配置
├── mock/                   # 开发用模拟数据
├── public/                 # 静态资源
├── src/                    # 源代码
│   ├── Layouts/            # 布局组件
│   ├── assets/             # 项目资源(样式、图标)
│   ├── components/         # 可复用组件
│   ├── composable/         # 组合式函数
│   ├── config/             # 应用配置
│   ├── middleware/         # 路由中间件
│   ├── pages/              # 页面组件(自动路由)
│   ├── store/              # Vuex/Pinia状态管理
│   ├── types/              # TypeScript类型定义
│   ├── utils/              # 工具函数
│   ├── App.vue             # 根组件
│   └── main.ts             # 应用入口
├── .env.*                  # 不同环境的环境变量
├── index.html              # HTML模板
├── package.json            # 项目依赖和脚本
├── tailwind.config.js      # Tailwind CSS配置
├── tsconfig.json           # TypeScript配置
└── vite.config.ts          # Vite配置
```

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
1. 进入容器启动服务
```
docker-compose exec webapp-page /bin/bash

pnpm install
pnpm run dev
```

[演示地址](https://wxsub.github.io/vite-element-template/)

## Tailwindcss
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

## 应用组件与组合式方法（composable）
系统内应用组件建议尽可能放入src/components文件夹内以提高代码可维护性。

对于一些使用频率较高的组件或js，你需要将该文件移入`src/composable`内，该目录内的文件将被系统自动加载而无需手动引入你的页面或组件，你无需担心扫描成本，因为它依旧是按需加载的，你只需在业务内使用对应的文件名去加载你的业务组件

对于ts或js文件，请使用export抛出你的方法，你可以在任意地方去使用你抛出的方法而无需引入。例如：

```
// src/composable/useAxios.ts
import service from '@/config/axios.config'

export function useAxios() {
  return service
}

// src/store/modules/user.ts
function login(loginData: object) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const response: any = await useAxios().post("/login", loginData)
      if (response?.token) {
        useStorage<string>("XSRF-TOKEN", response.token)
        resolve(response)
      } else reject(response)
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}
```

## Pages文件路由和Layout系统
系统会检查文件夹中src/pages是否存在任何.vue文件, 并根据文件名生成相应的路由结构。这样，您routes在向应用程序添加路由时就无需再维护数组。因此您需要使用统一规范和特定的方式去设计你的页面，路由元信息需要使用yaml语法写进route标签内，如下：
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
// 指定fullscreen作为layout
<route>
  {
    meta: { title: "B", roles: [], layout: "fullscreen" }
  }
</route>
```
Tips：layout字段指向的就是Layouts文件夹内所有.vue文件(默认default)你需要和文件名相同，因为者会导致路由生成失败

### route标签中meta合法属性解释

**注意**：基于unplugin-vue-router的规则，自定义的字段尽可能存入meta属性中，否则无法识别

1. **title**： 路由标题
2. **permission**： 路由权限
3. **layout**: 当前路由使用的布局，`src/Layouts/*.vue`目录下的文件名
4. **icon**: 当前路由icon，为侧边栏组件渲染使用，你的icon字段规则参考[`svg-icon`](#使用svg图标)组件`name`字段规则
5. **hidden**: 隐藏当前路由，当前路由不会出现在侧边栏位置，但可以通过链接访问该页面

**Tips**: `pages/redirect`目录下的所有文件（路由）， 都将默认添加`meta.hidden: true`规则, 当然它不会修改你已经设置的`meta.hidden`

### 索引路由
任何index.vue（必须全部小写）文件都会生成一个空路径（类似于index.html文件）：
1. src/pages/index.vue：生成/路线
2. src/pages/users/index.vue：生成/users路线

### 嵌套路由
可以利用 Vue Router 子路由来创建嵌套布局。通过在同名.vue文件夹旁边定义文件来自动定义嵌套路由。如果同时创建和组件，将在的中渲染。
` src/pages/users/index.vuesrc/pages/users.vuesrc/pages/users/index.vuesrc/pages/users.vue<RouterView> `
换句话说，给定以下文件夹结构：

```
src/pages/
  ├── users/
  │  ├── _id.vue
  │  └── index.vue
  └── users.vue
```

您将获得这个routes数组：

```
const routes = [
  {
    path: '/users',
    component: () => import('src/pages/users.vue'),
    children: [
      { path: '', component: () => import('src/pages/users/index.vue') },
    ],
  },
]
```
而省略该src/pages/users.vue组件将生成以下路由：
```
const routes = [
  {
    path: '/users',
    // notice how there is no component here
    children: [
      { path: '', component: () => import('src/pages/users/index.vue') },
    ],
  },
]
```

### 嵌套路由，无需嵌套布局
有时你可能想以斜杠的形式在URL 中添加嵌套，但又不想影响 UI 层次结构。请考虑以下文件夹结构：
```
src/pages/
├── users/
│   ├── _id.vue
│   └── index.vue
└── users.vue
```
如果要添加新路由，/users/create可以添加一个新文件，src/pages/users/create.vue但这会将create.vue组件嵌套在组件中users.vue。为了避免这种情况，您可以创建一个文件src/pages/users.create.vue。生成路由时，该文件.将变为：/
```
const routes = [
  {
    path: '/users',
    component: () => import('src/pages/users.vue'),
    children: [
      { path: '', component: () => import('src/pages/users/index.vue') },
      { path: ':id', component: () => import('src/pages/users/_id.vue') },
    ],
  },
  {
    path: '/users/create',
    component: () => import('src/pages/users.create.vue'),
  },
]
```

### 全部捕获 / 404 未找到路线
要创建捕获所有路由，...请在参数名称前添加三个点 ( )，例如，src/pages/[...path].vue将创建具有以下路径的路由：/:path(.*)。

这将匹配任何路由。请注意，这也可以在文件夹内执行，例如，src/pages/articles/[...path].vue将创建具有以下路径的路由：/articles/:path(.*)。

### 命名路线
所有生成的路由如果包含component属性，则都会包含name属性。这样可以避免意外地将用户定向到父路由。默认情况下，名称是使用文件路径生成的，但您可以通过传递自定义getRouteName()函数来覆盖此行为。您几乎可以在任何地方进行 TypeScript 验证，因此更改此设置应该很容易。

### 正常合法使用
```
├── about
│   └── index.vue
├── about.vue # 通过/about来访问该页面
├── blog  # 通过/blog来访问
│   ├── _id.vue # 动态路由
│   ├── index.vue
│   └── today
├── components.vue
└── index.vue # 当访问本地IP和端口号时的默认页面
```
虽然系统会扫描所有pages目录下的`.vue`文件，当然会将component目录过滤，因此你不必当心它们会被扫描进去路由系统。
尽管如此通常不建议将你的components文件写入pages目录内

你还需要注意：避免使用特殊符号在pages目录下新建文件或文件夹，特别是”-“，这会导致路由递归失败程序终止

### 捕获路由权限
需要的路由信息以及权限资源将统一来自/composable/usePermissions.ts, 你可以导出其permission方法，路由权限校验相关逻辑将存放于此

### 多个路线的路由文件夹
您需要在配置器（vite.config.ts）中找到plugins -> VueRouter添加routesFolder并传递数组来提供多个路由文件夹,routesFolder默认包含：src/pages

```
VueRouter({
  routesFolder: ['src/pages', 'src/admin/routes'],
})
```
您还可以为每个文件夹提供一个路径前缀，它将按原样使用，并且不能以 开头，/但可以包含您想要的任何参数，甚至不以 结尾/：
```
VueRouter({
  routesFolder: [
    'src/pages',
    {
      src: 'src/admin/routes',
      // note there is always a trailing slash and never a leading one
      path: 'admin/',
      // src/admin/routes/dashboard.vue -> /admin/dashboard
    },
    {
      src: 'src/docs',
      // you can add parameters
      path: 'docs/:lang/',
      // src/docs/introduction.vue -> /docs/:lang/introduction
    },
    {
      src: 'src/promos',
      // you can omit the trailing slash
      path: 'promos-',
      // src/promos/black-friday.vue -> /promos-black-friday
    },
  ],
})
```
请注意，提供的文件夹必须是独立的，并且一个路由文件夹不能包含另一个指定的路由文件夹。如果您需要进一步的自定义，请尝试使用[DefinePage() 方法](https://uvr.esm.is/guide/extending-routes#definepage)。

## 使用svg图标
系统采用svg icon的形式，svg图标默认统一放入`/src/assets/icons`内(修改改目录请在`vite.config.ts`内`createSvgIconsPlugin`进行修改)，使用时请使用svgIcon组件（系统已默认注册）
例如：
```html
<svg-icon name="github"></svg-icon>

// or

<svg-icon name="home-wxsub-dark"></svg-icon>  // [dir name]-[svg file name]
```

## 自动加载Element Plus Icon图标库
系统集成unplugin-icons、unplugin-auto-import插件规则从 iconify 中自动导入任何图标集。因此你在页面中使用Element Plus Icon图标库而无需import此图标，以下为使用案例
```
// use <el-icon><Plus /></el-icon>
<el-icon><i-ep-plus /></el-icon>

// use <el-icon><ArrowDown /></el-icon>
<el-icon><i-ep-arrowDown /></el-icon>
```
**说明​​：**
1. i-ep- 是固定前缀（i 为组件名前缀，ep 代表 Element Plus 图标库）
2. 图标名需转为​首字母大写其它全小写格式​​（如 Plus → plus、ArrowDown → arrowDown）

**避免重复导入图标进入系统造成的性能浪费**

## 全局scss变量
系统为每个组件引入了一个scss变量文件（src/assets/styles/variables.scss），你可以自行在该文件内设计属于自己的scss变量或方法在任意组件style中使用
```css
.container {
  width: vm(100);
}

// or

.container {
  font-size: 24px;
  @include responsive('mobile') {
    font-size: 16px;
  }
  @include responsive('tablet') {
    font-size: 18px;
  }
}
```

## FormKit Component
基于ElementPlus表单组件进行的组合封装，通过数据流方式将表单数据化，方便快速开发。

### Component Attributes
| 参数         | 说明    |    类型   |  默认值  | 
| -------- | :-----  |  :----:  |  :----: |
| model-value / v-model |  组件绑定数据源  |  Object  |   {}
| config |  表单配置项，详细config配置参数参考下方`config Attributes`  |  Array  |   []
| disabled |  禁用整个表单  |  Boolean  |   false  
| labelPosition |  表单项label对齐规则，参照[ElementPlus Form Attributes](https://element-plus.org/zh-CN/component/form.html#form-api)  |  String  |   top  
| labelWidth |  表单项标题宽度（此参数仅在labelPosition为left、right时生效，为top时会自动忽略）  |  Number  |   125 
| columns |  每行显示多少列表单项  |  Number / String  |   5  
| size |  用于控制该表单内组件的尺寸（可选值: '' / 'large' / 'default' / 'small'）  |  String  |   mini 
| rows |  参照[ElementPlus Row API](https://element-plus.org/zh-CN/component/layout.html#row-api)  |  String  |   top

**注意**： `columns`设置为字符串`'auto'`后`label-width`将失效，失效后的计算结果为`0px`

### Config Attributes
| 参数         |  说明  |  可选值  |   类型   |  案例
| -------- | :-----:  |  :----: |  :----:  | :----: |
| label |  表单项名称  |   -   |  String  |  -
| type |  该表单项类型  |   可自行配置，默认见下Config type explain   |  String  | -
| disabled |  该表单项是否禁用  |   true / false   |  boolean  |  -
| keys |  表单项key值(该项应该和后台返回该表单项的字段对应，方便将修改后的数据与后台直接交互)  |   -   |  String  |  -
| span |  当前项栅格占据的列数  |   24   |  number  |   24
| labelWidth |  标签的长度，例如 '50px'。 作为 Form 直接子元素的 form-item 会继承该值。 可以使用 auto。  |   -   |  string / number  |   ''
| rules |  表单项校验规则，为空不校验  |   -   |  Array  |   -
| options |  select、cascader等组件的操作项  |   -   |  Array  |  ` options: [{ name: '全天营业', id: 'ALL' }] `
| request |  该表单项需要进行远程数据加载的自定义请求  |   -   |  Promise  |  ` request: useAxios().get('/default/shop/category-tree') `
| handle |  配合远程数据加载，处理远程数据  |   -   |  Function  |  ` handle: (response: any) => Array.isArray(response) ? response : [] `
| props |  直接绑定到组件上的参数  |   -   |  Object  |  `props: { placeholder: '请输入店铺编码', max: 10 }`
| visible |  该表单项显示需要关联的字段  |   -   |  Object  |  ` visible: { key: "showid", value: 0 } `表示表单内字段`showid`的值为0时该项不显示
| events |  接受组件事件  |   -   |  Object  |  -
| hint |  在当前行下方显示提示文本  |   -   |  string  |  -

### Config type explain
| 关键字         |  说明  |  备注
| -------- | :-----:  |  :----: |
| input |  输入框  |  -
| select |  下拉选择框  |  -
| datePicker |  日期时间选择器  |  [文档](https://element-plus.org/zh-CN/component/datetime-picker.html)
| timePicker |  时间选择器  |  [文档](https://element-plus.org/zh-CN/component/time-picker.html)
| cascader |  级联选择器  |  [文档](https://element-plus.org/zh-CN/component/cascader.html)
| remoteSearchSelect |  带远程搜索功能的input  |  参数回显请使用initialValue字段
| address |  地址选择器  |  内部fetchAddressData方法需要修改API接口
| checkbox |  多选框  |  -
| radio |  单选框  |  -
| inputNumber |  数字输入框  |  -
| upload |  文件上传  |  需要在utils/upload.class.ts修改uploadUrl
| rate |  评分  |  [文档](https://element-plus.org/zh-CN/component/rate.html)

### FormKit Slots
| 插槽名         |  说明  |  参数
| -------- | :-----:  | :-----:  |
| prepend |  输入框前置内容 | -
| append |  表单项后置内容 | -
| content |  表单平级内容 | configs => 配置项
| ${config.keys} |  表单项内容组件平级内容 | row => 当前config项、value => 组件绑定值

### Exposes
| 名称         |  说明 |  参数  |  类型
| -------- | :-----:  | :-----:  | :-----:  |
| validate | 立即校验表单项 | openTips => 校验失败是否弹出提示 | Promise
| clearValidate | 清除表单校验项 | - | Function

## SFTP本地文件自动化上传部署

如果公司未未前端设置CI/CD，本地文件自动化上传部署似乎是个不错的选择
**默认使用的是SSH SFTP**进行本地文件推送，你需要修改`/deploy/sftp.mjs`内`sftpServeConfig`您的服务器信息
```
// 发布开发环境
pnpm run deploy:development

// 发布生产环境
pnpm run deploy:production
```

若后端限制只能使用ftp协议进行上传，需要先进行安装
```
pnpm add basic-ftp -D
```
然后修改`/deploy/ftp.mjs`文件内的配置信息

```
// 执行
node deploy/ftp.mjs --mode development
```

**--mode为指定的环境变量，你需要放进指令最后**

当然您也可以使用scp进行文件上传, 修改package.json中scripts.scp命令中的`<User Name>`、`<Server Public IP>`、`<Server directory>`
```
pnpm run scp
```

## Mock Data
系统集成了mockjs，请在`mock`文件夹下创建模拟api规范
关于mockjs的使用请转至[mockjs官网](https://github.com/nuysoft/Mock/wiki)，或参考以下示例

```javascript
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
```

## Contributors
<table>
    <tr>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a target="_blank" href="https://github.com/zhizhi-sun">
                <img src="./public/Contributors/72124234.jfif" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>zhizhi-sun</b></sub>
            </a>
        </td>
        <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
            <a target="_blank" href="https://github.com/zhizhi-sun">
                <img src="./public/Contributors/TroyLemon.png" width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px"/>
                <br />
                <sub style="font-size:14px"><b>TroyLemon</b></sub>
            </a>
        </td>
    </tr>
</table>

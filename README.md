# vite-element-template webapp

**English** | [中文](./README.zh_CN.md)

Based on vue3+vite+elementPlus a fast front-end back-end framework to build the project, the project integrates automated publishing solutions, elementUI dynamic component import, axios, mockjs and docker and so on.

**Project node version no less than 18.0.0**

```
npm install -g pnpm
// check you pnpm pnpm -v

// development startup
pnpm install
pnpm run dev

// build
pnpm run build
```

## Docker way development startup
1. [install docker](https://www.docker.com)
2. Build and start the container
```
docker-compose up --build -d
```
1. Enter the container startup service
```
docker-compose exec webapp-page /bin/bash

pnpm install
pnpm run dev
```

[Demo Preview](https://wxsub.github.io/vite-element-template/)

## Tailwindcss
system built-in tailwindcss, tailwindcss is a very good css auxiliary script, with vue3 dynamic introduction of the design, so most of the css don't have to draw, special needs style processing, please check under src/assets/styles/ whether there are
similar css module, if there is no corresponding css module, you may need to manually write in the style tag, of course, it is also a very small part of the recommended fast writing css reference
[tailwindcss documentation](https://tailwindcss.com/docs/), with editor's automatic prompts, you will get amazing development story.
Of course use your VSCode plugin with is a good choice [plugin - search and install tailwindcss]
*vscode No smart tips？*
```json
{
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

## Application Components and Combinatorial Approach（composable）
It is recommended that application components be placed in the src/components folder whenever possible to improve code maintainability.

For more frequently used components or js, you need to move the files into `src/composable`, the files in this directory will be automatically loaded by the system without the need to manually bring in your pages or components, you don't need to worry about scanning costs, because it is still on-demand, you just need to use the corresponding file name within the business to load your business components.

For ts or js files, please use export to throw your method, you can use your thrown method anywhere without introducing it. For example:

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

## Pages file routing and Layout system
The system checks for any .vue files in the src/pages folder and generates a route structure based on the file name. This way, you routes no longer need to maintain an array when adding routes to your application. So you need to design your pages in a consistent and specific way. Route meta information needs to be written in the route tag using yaml syntax, as follows:
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
For the name field of the route, you don't need to add it intentionally, the system will automatically generate it, of course, even if you add it, the system will not use it.

This way of writing in the editor there may not be able to highlight, it is difficult to see, so if necessary, through the following steps to set your Vetur
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
Restart VS Code to get syntax highlighting for custom blocks.

The Layout System uses a design that mixes layouts into routes, for unconventional layouts you have to design your layout in the Layouts directory of the system, of course when designing a layout you need to avoid Chinese filenames, because it still uses the filename as the key.
Of course, you need to avoid Chinese filenames when designing layouts, because it still uses the filename as the key.
```vue
// Specify fullscreen as layout
<route>
  {
    meta: { title: "B", roles: [], layout: "fullscreen" }
  }
</route>
```
Tips：The layout field points to all the .vue files in the Layouts folder (default default) you need to have the same name as the file, as this will cause the route generation to fail.

### Explanation of meta legal attributes in route tags

**Warning**：Based on the rules of unplugin-vue-router, custom fields are deposited in the meta attribute if possible, otherwise they will not be recognized

1. **title**: Routing title
2. **roles**: route permissions, reserved permissions field
3. **layout**: the layout used by the current route, the name of the file in the `src/Layouts/*.vue` directory
4. **icon**: the current route icon, for sidebar component rendering, your icon field rules refer to [`svg-icon`](#use svg icon) component `name` field rules
5. **hidden**: hide the current route, the current route will not appear in the sidebar, but can be accessed through the link to the page

**Tips**: All files (routes) in the `pages/redirect` directory will not be designed by the permissions system

### Index routing
Any index.vue (must be all lowercase) file generates an empty route (similar to an index.html file):
1. src/pages/index.vue: generates the / route
2. src/pages/users/index.vue: generates the /users route

### Nested routes
Nested layouts can be created using Vue Router subroutes. Nested routes are automatically defined by defining files next to a .vue folder of the same name. If both and component are created, they will be rendered in the.
` src/pages/users/index.vuesrc/pages/users.vuesrc/pages/users/index.vuesrc/pages/users.vue<RouterView> `
In other words, given the following folder structure:

```
src/pages/
  ├── users/
  │  ├── [id].vue
  │  └── index.vue
  └── users.vue
```

You will get this array of routes：

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
And omitting that src/pages/users.vue component will generate the following route：
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

### Nested Routing without Nested Layouts
Sometimes you may want to add nesting to URLs in the form of slashes, but you don't want to affect the UI hierarchy. Consider the following folder structure:
```
src/pages/
├── users/
│   ├── [id].vue
│   └── index.vue
└── users.vue
```
To add a new route, /users/create could add a new file, src/pages/users/create.vue but this would nest the create.vue component within the component users.vue. To avoid this, you can create a file src/pages/users.create .vue. When you generate the route, the file . will become: /
```
const routes = [
  {
    path: '/users',
    component: () => import('src/pages/users.vue'),
    children: [
      { path: '', component: () => import('src/pages/users/index.vue') },
      { path: ':id', component: () => import('src/pages/users/[id].vue') },
    ],
  },
  {
    path: '/users/create',
    component: () => import('src/pages/users.create.vue'),
  },
]
```

### Capture All / 404 Route Not Found
To create a capture all route, ... Add three dots ( ) before the parameter name, e.g., src/pages/[... .path].vue will create routes with the following paths: /:path(. *).

This will match any route. Note that this can also be executed within a folder, e.g., src/pages/articles/[... .path].vue will create routes with the following path: /articles/:path(. *).

### Naming routes
All generated routes will include the name attribute if they contain the component attribute. This prevents accidentally directing users to the parent route. By default, names are generated using file paths, but you can override this behavior by passing a custom getRouteName() function. You can do TypeScript validation almost anywhere, so changing this setting should be easy.

### Normal legal use
```
├── [... .all].vue # Capture all routes, often used for 404s
├── about
│ └── index.vue
├── about.vue # Access this page via /about
├── blog # Access the page via /blog
│ ├── [id].vue # Dynamic routing
│ ├── index.vue
│ └── today
├── components.vue
└── index.vue # Default page when accessing local IP and port numbers
```
While the system will scan all `.vue` files in the pages directory, it will of course filter the components directory so you don't have to be concerned about them being scanned into the routing system.
However, it is generally not recommended to write your components files in the pages directory.

You should also note that you should avoid using special symbols to create new files or folders in the pages directory, especially “-”, as this will cause the routing recursion to fail and the program to terminate.

### Capturing routing permissions
The required route information and permission resources will be unified from /config/router.permission.js, and you can export its permission method, where all the data for loading the system will be stored.

### Route folders for multiple routes
You need to find plugins -> VueRouter in the configurator (vite.config.ts) and add routesFolder and pass an array to provide multiple routes folders, routesFolder contains by default: src/pages

```
VueRouter({
  routesFolder: ['src/pages', 'src/admin/routes'],
})
```
You can also provide a path prefix for each folder, which will be used as is and cannot start with / but can contain any arguments you want, even without ending with /:
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
Please note that the folders provided must be independent and that a routing folder cannot contain another specified routing folder. If you need further customization, try using the [DefinePage() method](https://uvr.esm.is/guide/extending-routes#definepage).

## Use svg icon
The system uses svg icon, svg icons are put into `/src/assets/icons` by default (if you want to change the directory, please change it in `createSvgIconsPlugin` in `vite.config.ts`), when you use it, please use the svgIcon component (the system has registered it by default).
For example:
```html
<svg-icon name="github"></svg-icon>

// or

<svg-icon name="home-wxsub-dark"></svg-icon>  // [dir name]-[svg file name]
```

## Autoload Element Plus Icon Icon Library
The system integrates unplugin-icons, unplugin-auto-import plugin rules to automatically import any icon set from iconify. So you can use Element Plus Icon icon library in your page without importing this icon, here is the use case
```
// use <el-icon><Plus /></el-icon>
<el-icon><i-ep-plus /></el-icon>

// use <el-icon><ArrowDown /></el-icon>
<el-icon><i-ep-arrowDown /></el-icon>
```
**Note: **
1. i-ep- is a fixed prefix (i is the prefix of the component name, ep stands for Element Plus icon library)
2. Icon names should be converted to upper case and lower case (e.g. Plus → plus, ArrowDown → arrowDown).

**Avoid wasted performance by importing duplicate icons into the system.

## Global scss variables
The system introduces a scss variables file (src/assets/styles/variables.scss) for each component, you can design your own scss variables or methods to be used in any component style.
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

## ElementPlus-based FormKit Component
Based on ElementPlus form components for the combination of packaging , through the data flow method of the form data , to facilitate rapid development .

### Component Attributes
| Parameters | Description | Types | Defaults | 
| -------- | :----- | :----: | :----: |
| model-value / v-model | Component Binding Data Source | Object | {}
| config | Form configuration items, detailed config configuration parameters refer to `config Attributes` below | Array | []
| disabled | Disable entire form | Boolean | false  
| labelPosition | Label alignment rules, refer to [ElementPlus Form Attributes](https://element-plus.org/zh-CN/component/form.html#form-api) | String | top  
| labelWidth | labelWidth of the title of the form item (this parameter is only valid when labelPosition is left or right, and will be ignored when labelPosition is top) | Number | 125 
| columns | How many list items are displayed in each row | Number / String | 5  
| size | The size of the components in the form (optional: '' / 'large' / 'default' / 'small') | String | mini 
| rows | See [ElementPlus Row API](https://element-plus.org/zh-CN/component/layout.html#row-api) | String | top

**Note**: `label-width` will be invalidated when `columns` is set to the string `'auto'`, and the result will be `0px` when it is invalidated.

### Config Attributes
| Parameters | Description | Optional Values | Types | Cases
| -------- | :-----: | :----: | :----: | :----: | ----: |
| label | The name of the form item | - | String | -
| type | The type of the form item | Configurable, see Config type explain | String | - | disabled | The type of the form item | Can be configured, see below for default.
| disabled | Whether the form item is disabled | true / false | boolean | - | keys | The form item's keys.
| keys | The key value of the form item (this item should correspond to the field returned by the backend, so that it is convenient to directly interact the modified data with the backend) | - | String | - | The current item's key value.
| span | Number of columns occupied by the current item | 24 | number | 24
| labelWidth | The length of the label, e.g. '50px'. This value is inherited by form-item as a direct child of Form. auto can be used. | - | string / number | ''
| rules | Form-item checking rules, null is not checked | - | Array | - | options | select, ccType | select, ccType | select, ccType | select
| options | select, cascader, etc. | - | Array | ` options: [{ name: 'Open All Day', id: 'ALL' }] `
| request | Custom request for remote data loading for this form item | - | Promise | ` request: useAxios().get('/default/shop/category-tree') `
| handle | Work with remote data loading, handle remote data | - | Function | ` handle: (response: any) => Array.isArray(response) ? response : [] `
| props | Parameters bound directly to the component | - | Object | `props: { placeholder: 'Please enter the store code', max: 10 }`
| visible | This form item displays the field that needs to be associated with it | - | Object | ` visible: { key: “showid”, value: 0 } `Indicates that this item will not be displayed if the value of the field `showid` is 0 within the form.
| events | accept component events | - | Object | -
| hint | Show hint text below current line | - | string | -

### Config type explain
| Keywords | Description | Remarks
| -------- | :-----: | :----: |
| input | input box | -
| select | drop-down selection box | -
| datePicker | DateTimePicker | [Documentation](https://element-plus.org/zh-CN/component/datetime-picker.html)
| timePicker | timePicker | [Documentation](https://element-plus.org/zh-CN/component/time-picker.html)
| cascader | Cascade Selector | [documentation](https://element-plus.org/zh-CN/component/cascader.html)
| remoteSearchSelect | input with remote search | Use the initialValue field for parameter fallback.
| address | addressSelect | Internal fetchAddressData method requires API modification.
| checkbox | radio | Radio | SingleCheckBox | checkboxes -
| radio | Radio | SingleCheckBox | -
| inputNumber | number input box | -
| upload | File Upload | uploadUrl needs to be modified in utils/upload.class.ts.
| rate | rating | [documentation](https://element-plus.org/zh-CN/component/rate.html)

### FormKit Slots
| Slot Name | Description | Parameters
| -------- | :-----: | :-----: |
| prepend | Input box front content | -
| append | form item post content | -
| content | form level content | configs => config item
| ${config.keys} | form item content component level content | row => current config item, value => component binding value

### Exposes
| Name | Description | Parameters | Type
| -------- | :-----: | :-----: | :-----: |
| validate | Validate form items now | openTips => If or not popup tips for failed validation | Promise
| clearValidate | clearValidate | - | Function

## SFTP Local File Upload Deployment Automation

If your company has not set up CI/CD on the front-end, local file upload automation deployment seems to be a good choice!
**By default, SSH SFTP** is used for local file push, you need to modify `/sftpServeConfig` your server information in `/deploy/sftp.mjs`, and `/sftpServeConfig` your server information in `/sftpServeConfig`.
``
// Publish the development environment
pnpm run deploy:development

// Publish the production environment
pnpm run deploy:production
```

If the backend restricts uploads to the ftp protocol, you need to install it first
```
pnpm add basic-ftp -D
```
Then change the configuration information in the `/deploy/ftp.mjs` file

```
// Execute
node deploy/ftp.mjs --mode development
``` // Run node deploy/ftp.mjs --mode development.

** --mode is the environment variable you need to put at the end of the command**.

Of course you can also use scp for file uploads, change the `<User Name>`, `<Server Public IP>`, `<Server directory>` in the scripts.scp command in package.json.
``
pnpm run scp
```

## Mock Data
The system integrates mockjs, please create mock api specification under `mock` folder.
For more information about using mockjs, please go to [mockjs official website](https://github.com/nuysoft/Mock/wiki), or refer to the following example

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

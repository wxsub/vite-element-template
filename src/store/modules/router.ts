import { defineStore } from "pinia"
import { store } from "@/store"

export const routerStore = defineStore("router", () => {
  const whiteList: Array<string> = [], router: any = reactive({
    hashmap: null, routes: []
  });

  const setRoutes = (data: Array<object>) => {
    router.routes = filterRoutes(data)
  }

  return { router, setRoutes, whiteList }
})

// 非setup
export function useRouterStoreHook() {
  return routerStore(store)
}

function filterRoutes(routes: Array<object>) {
  if (Array.isArray(routes)) {
    return generateRoutes(routes)
  } else return []
}
function generateRoutes(routes: Array<object>) {
  return routes.map((route: any) => {
    const { children = [], meta, path } = route
    const result: any = { children: generateRoutes(children), path, title: path }
    if (meta?.hash) result.hashmap = meta.hash
    if (meta?.title) { result.title = meta.title } else {
      const { meta } = children.find((it: any) => it?.path === "") || {}
      if (meta?.title) result.title = meta.title
    }
    return result
  })
}

import { defineStore } from "pinia"
import { store } from "@/store"
import { reactive } from "vue"

export const routerStore = defineStore("router", () => {
  const whiteList: Array<string> = [],
    routers: any = reactive({
      options: [], generate: []
    });

  const setRoutes = (data: Array<object> | any) => routers.options = data

  return { routers, setRoutes, whiteList }
})

export function useRouterStoreHook() {
  return routerStore(store)
}

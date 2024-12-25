import { defineStore } from "pinia"
import { store } from "@/store"
import { ref } from "vue"

export const routerStore = defineStore("router", () => {
  const whiteList: Array<string> = [],
    routers: any = ref([]);

  const setRoutes = (data: Array<object> | any) => routers.value = data

  return { routers, setRoutes, whiteList }
})

export function useRouterStoreHook() {
  return routerStore(store)
}

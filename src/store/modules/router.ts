import { defineStore } from "pinia"
import { store } from "@/store"

const ConstantMenus = [
  { name: "首页", path: "/", icon: "House" }
];

export const routerStore = defineStore("router", () => {
  const whiteList: Array<string> = [],
    SidebarMenus: any = ref([]),
    routers: any = ref([]);

  const setRoutes = (data: Array<object> | any) => routers.value = data

  return { routers, setRoutes, whiteList, SidebarMenus }
})

export function useRouterStoreHook() {
  return routerStore(store)
}

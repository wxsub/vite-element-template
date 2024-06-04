import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import { hasPermission } from '@/utils/hexadecimalOperator'
import WSS, { WebSocketInterface } from "@/utils/wss.class"
import {
    createRouter,
    createWebHashHistory,
    createWebHistory,
    RouteLocationNormalized,
    NavigationGuardNext
} from 'vue-router'
import { routes } from 'vue-router/auto/routes'
import { useRouterStoreHook } from "@/store/modules/router"
import { useUserStoreHook } from "@/store/modules/user"
import { useChannelStore } from "@/store/modules/channel"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import { isEmpty } from "lodash"
let SystemWebSocket: WebSocketInterface | null = null

const routerStore = useRouterStoreHook(),
  userStore = useUserStoreHook(),
  channelStore = useChannelStore();

NProgress.configure({ showSpinner: false })

const whiteList = routerStore.whiteList

const router = createRouter({
    history: createWebHistory(),
    routes: setupLayouts(generatedRoutes),
    scrollBehavior: () => ({ left: 0, top: 0 })
})

const TICKET = useStorage<string>("XSRF-TOKEN", null).value || "empty"

routerStore.setRoutes(routes)
// console.log(routerStore.router.routes)

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const { meta, query } = to || {},
        { hash } = meta || {},
        redirect = query?.redirect;
    NProgress.start()
    browserSetter(meta)
    if (TICKET) {
      try {
        if (hasWhiteList(to.path)) {
          if (to.path === "/redirect/sign-in") {
            next({ path: "/" })
          } else next()
        } else {
          // await userStore.getUserInfo()
          // const { hashmap } = routerStore.router
          // await initializeSystemWebSocketSetup(TICKET)
          if (hash) {
            next({ ...to, replace: true })
          } else next()
        }
        NProgress.done()
      } catch (error) {
        next(`/redirect/error?type=inactive&title=网络连接异常&content=${JSON.stringify(error)}`)
        NProgress.done()
      }
    } else {
      if (hasWhiteList(to.path)) { next() } else {
        next(redirect ? `/redirect/sign-in?redirect=${redirect}` : `/redirect/sign-in`)
        NProgress.done()
      }
    }
})

router.afterEach(() => NProgress.done())

export default router

export async function resetRouter(callback: Function) {
    const routes = router.getRoutes()
    routes.forEach(route => router.removeRoute(route.name as string))
    await router.replace({path: "/login"})
    if (callback) callback(router.getRoutes())
}

async function initializeSystemWebSocketSetup(hash: string) {
  try {
    if (isEmpty(SystemWebSocket)) {
      SystemWebSocket = new WSS(hash)
      await SystemWebSocket.create('system')
    }
    SystemWebSocket?.setMessageListener((response: any) => {
      const { userid, info = {}, content = {}, sessionId: id, userType } = response?.data || {}
      if (isEmpty(id)) return console.log(`can not found channel(sessionId) ${id}`)
      const channels = channelStore.channels[id]
      if (channels) {
        channelStore.conversation(id, response.data || {})
      } else {
        channelStore.setter(id, { ...info, id, userid, unread: 1, type: userType })
        if (content?.['message']) channelStore.conversation(id, response.data || {})
      }
    })
  } catch (e) {
    console.warn(e)
  }
}

function hasWhiteList(path: string) {
  return /^\/redirect\/.*$/.test(path) || whiteList.includes(path)
}

function browserSetter(route: any) {
    if (route && route.title) window.document.title = route.title
}

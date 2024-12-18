import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import wss, { WebSocketInterface } from "@/utils/wss.class"
import {
    createRouter,
    createWebHistory,
    RouteLocationNormalized,
    NavigationGuardNext
} from 'vue-router'
import { useRouterStoreHook } from "@/store/modules/router"
import { useUserStoreHook } from "@/store/modules/user"
import { useSystemStore } from "@/store/modules/system"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import { isEmpty } from "lodash"
let SystemWebSocket: WebSocketInterface | null = null

const routerStore = useRouterStoreHook(),
  systemStore = useSystemStore(),
  userStore = useUserStoreHook();

NProgress.configure({ showSpinner: false })

const whiteList = routerStore.whiteList

const router = createRouter({
    history: createWebHistory(),
    routes: setupLayouts(generatedRoutes),
    scrollBehavior: () => ({ left: 0, top: 0 })
})

routerStore.setRoutes(router.options.routes)

router.beforeEach(async (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  NProgress.start()
  const { meta, query } = to || {},
    { hash } = meta || {};
  browserSetter(meta)

  const TICKET = localStorage.getItem("XSRF-TOKEN") || null
  if (TICKET) {
    try {
      if (hasWhiteList(to.path)) {
        if (to.path === "/redirect/sign-in") {
          next({ path: "/" })
        } else next()
      } else {
        await userStore.getUserInfo() // fetch user info
        // await initializeSystemWebSocketSetup(TICKET)  // creat global websocket, if you not Need comment
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
      const redirect = query?.redirect
      next(redirect ? `/redirect/sign-in?redirect=${redirect}` : `/redirect/sign-in`)
      NProgress.done()
    }
  }
})

router.afterEach(() => NProgress.done())

export default router

async function initializeSystemWebSocketSetup(hash: string) {
  try {
    if (isEmpty(SystemWebSocket)) {
      SystemWebSocket = new wss(hash)
      await SystemWebSocket.create('system')
    }
    SystemWebSocket?.setMessageListener((response: any) => {
      if (response?.data) {
        systemStore.setStream(response.data)
      } else {
        console.log(`system websocket not found for response: ${JSON.stringify(response)}`)
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

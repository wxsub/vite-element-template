import { setupLayouts } from 'virtual:meta-layouts'
import generatedRoutes from 'virtual:generated-pages'
import wss, { WebSocketInterface } from "@/utils/wss.class"
import middlewares from "@/utils/middleware"
import {
  createRouter,
  RouteLocationNormalized,
  NavigationGuardNext,
  createWebHashHistory
} from 'vue-router'
import { useRouterStoreHook } from "@/store/modules/router"
import { useSystemStore } from "@/store/modules/system"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import { isEmpty } from "lodash"

let SystemWebSocket: WebSocketInterface | null = null

const routerStore = useRouterStoreHook(),
  systemStore = useSystemStore();

NProgress.configure({ showSpinner: false })

const routes = setupLayouts(generatedRoutes);

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

routerStore.setRoutes(routes)

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  NProgress.start()

  await middlewares(to, from, next, router)
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

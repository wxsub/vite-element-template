import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useUserStoreHook } from "@/store/modules/user"
import { useRouterStoreHook } from "@/store/modules/router"

const userStore = useUserStoreHook(),
  routerStore = useRouterStoreHook();

export default function defaultMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const { meta, query } = to || {},
    { title } = meta || {};

  const TICKET = localStorage.getItem("XSRF-TOKEN") || null
  if (TICKET) {
    try {
      if (hasWhiteList(to.path)) {
        if (to.path === "/redirect/sign-in") {
          browserSetter(title)
          next({ path: "/" })
        } else {
          browserSetter(title)
          next()
        }
      } else {
        // await userStore.getUserInfo() // fetch user info
        browserSetter(title)
        next()
      }
    } catch (error) {
      browserSetter("网络连接异常")
      next(`/redirect/error?title=网络连接异常&content=${JSON.stringify(error)}`)
    }
  } else {
    if (hasWhiteList(to.path)) {
      browserSetter(title)
      next()
    } else {
      const redirect = query?.redirect
      browserSetter(title)
      next(redirect ? `/redirect/sign-in?redirect=${redirect}` : `/redirect/sign-in`)
    }
  }
}

function browserSetter(title: any) {
  if (title) {
    window.document.title = title
  }
}

function hasWhiteList(path: string) {
  return /^\/redirect\/.*$/.test(path) || routerStore.whiteList.includes(path)
}
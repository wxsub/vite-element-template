import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useUserStoreHook } from "@/store/modules/user"
import { useRouterStoreHook } from "@/store/modules/router"

const userStore = useUserStoreHook(),
  routerStore = useRouterStoreHook();

export default async function defaultMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> {
  const { meta, query } = to || {},
    { title, permission } = meta || {};

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
        await userStore.getUserInfo() // fetch user info
        browserSetter(title)
        if (permission) {
          if (usePermissions().verify(permission)) {
            next()
          } else {
            next(`/redirect/error?title=权限不足&content=${JSON.stringify(permission)}`)
          }
        } else {
          next()
        }
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
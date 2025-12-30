import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useUserStoreHook } from '@/store/modules/user'

export default function authMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const userStore = useUserStoreHook()
  
  // 检查用户是否已登录
  if (!userStore.token) {
    next({ path: '/redirect/sign-in', query: { redirect: to.fullPath } })
    return
  }
  
  next()
}
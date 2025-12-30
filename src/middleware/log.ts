import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

export default function logMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  console.log(`[Route Log] From: ${from.path} To: ${to.path}`, new Date())
  next()
}
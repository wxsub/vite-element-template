import { reactive } from 'vue'
import type { Router, RouteLocationNormalized, NavigationFailure } from 'vue-router'
import type { BreadcrumbConfig, BreadcrumbItem } from '@/types/router'

export class Breadcrumbs {
  #router: Router
  value: BreadcrumbItem[]

  constructor(router: Router) {
    this.#router = router
    this.value = reactive<BreadcrumbItem[]>([])
  }

  init(): void {
    this.#router.afterEach((...args: [RouteLocationNormalized, RouteLocationNormalized, (NavigationFailure | undefined | void)]) => {
      const [route, from, failure] = args
      if (failure || (route.path === from.path && from.matched.length)) return
      this.setBreadcrumbsByRoute(route)
    })
  }

  setBreadcrumbsByRoute(route: RouteLocationNormalized): void {
    if (!route) return
    const arPath = route.path.replace(/\/$/, "").split('/')
    let iterablePath = ''
    let spliced = false

    arPath.forEach((item: string, i: number) => {
      iterablePath += (i === 1) ? item : '/' + item
      const isCurrentCrumb = i + 1 >= arPath.length

      if (this.value[i]?._path === iterablePath) {
        if (isCurrentCrumb) this.value.splice(i + 1, this.value.length)
        this.value[i].current = isCurrentCrumb
        return
      } else if (!spliced && i < this.value.length) {
        this.value.splice(i, this.value.length)
        spliced = true
      }

      const breadcrumb = this.createBreadcrumb(iterablePath, isCurrentCrumb)

      if (!breadcrumb) return

      this.value.push(breadcrumb)
    })
  }

  createBreadcrumb(path: string, isCurrent: boolean = false): BreadcrumbItem | false {
    if (!path) return false
    const crumbRoute = this.#router.resolve(path)
    
    const breadcrumbConfig = crumbRoute.meta?.breadcrumb as (string | BreadcrumbConfig | ((route: any) => string | BreadcrumbConfig)) || crumbRoute.meta?.title as string
    
    let resolvedBreadcrumb: string | BreadcrumbConfig
    if (typeof breadcrumbConfig === 'function') {
      resolvedBreadcrumb = breadcrumbConfig.call(null, crumbRoute)
    } else {
      resolvedBreadcrumb = breadcrumbConfig
    }

    if (!resolvedBreadcrumb) return false

    const isBcObject = typeof resolvedBreadcrumb === 'object' && resolvedBreadcrumb !== null && 'label' in resolvedBreadcrumb

    const label = isBcObject ? (resolvedBreadcrumb as BreadcrumbConfig).label : (resolvedBreadcrumb as string)
    const linkValue = isBcObject ? (resolvedBreadcrumb as BreadcrumbConfig).link || crumbRoute.path : crumbRoute.path
    const link = typeof linkValue === 'function' ? linkValue(crumbRoute.path) : linkValue

    return {
      label,
      link,
      current: isCurrent,
      _path: path
    }
  }
}
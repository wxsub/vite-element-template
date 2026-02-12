import { reactive, watch } from 'vue'
import type { Router, RouteLocationNormalized, NavigationFailure } from 'vue-router'
import type { BreadcrumbConfig, BreadcrumbItem } from '@/types/router'
import { useRouterStoreHook } from '@/store/modules/router'

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
      if (failure) return
      if (route.fullPath === from.fullPath) return
      this.setBreadcrumbsByRoute(route)
    })

    const routerStore = useRouterStoreHook()
    watch(() => routerStore.SidebarMenus, () => {
      if (this.#router.currentRoute.value) {
        this.setBreadcrumbsByRoute(this.#router.currentRoute.value)
      }
    })
  }

  setBreadcrumbsByRoute(route: RouteLocationNormalized): void {
    if (!route) return

    const routerStore = useRouterStoreHook()
    const menus = routerStore.SidebarMenus
    
    // Try to resolve breadcrumbs from menu structure first
    const menuPath = this.findMenuPath(menus, route.path)
    
    if (menuPath && menuPath.length > 0) {
      const newBreadcrumbs: BreadcrumbItem[] = []
      
      // Ensure Home is present if not first item
      if (menuPath[0].path !== '/') {
        const homeCrumb = this.createBreadcrumb('/')
        if (homeCrumb) newBreadcrumbs.push(homeCrumb)
      }

      menuPath.forEach((menu, index) => {
        const isCurrent = index === menuPath.length - 1
        const label = menu.meta?.title || menu.menuName || menu.name
        const link = menu.path
        
        if (label && link) {
           newBreadcrumbs.push({
              label,
              link,
              current: isCurrent,
              _path: link
           })
        }
      })
      
      this.value.splice(0, this.value.length, ...newBreadcrumbs)
      return
    }

    // Fallback to existing logic
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

  findMenuPath(menus: any[], targetPath: string): any[] | null {
    if (!menus) return null
    
    for (const menu of menus) {
        // Exact match
        if (menu.path === targetPath) {
             if (menu.children && menu.children.length) {
                 const childPath = this.findMenuPath(menu.children, targetPath)
                 if (childPath) return [menu, ...childPath]
             }
             return [menu]
        }
        
        // Recursive check
        if (menu.children && menu.children.length) {
            const childPath = this.findMenuPath(menu.children, targetPath)
            if (childPath) return [menu, ...childPath]
        }
    }
    return null
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
import { isEmpty } from "lodash"
import { RouteLocationNormalized, NavigationGuardNext, RouteLocationRaw, Router } from 'vue-router'

const middleware = import.meta.glob<{
    default: (
        to: RouteLocationNormalized,
        from: RouteLocationNormalized,
        next: NavigationGuardNext
    ) => void
}>('@/middleware/*.ts', { eager: true })

const middlewareMap = new Map<string, (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => void>();

Object.entries(middleware).forEach(([fullPath, module]) => {
    const fileNameSegment = fullPath.split('/').pop()
    if (fileNameSegment && module.default) {
        const middlewareKey = fileNameSegment.replace('.ts', '')
        middlewareMap.set(middlewareKey, module.default)
    }
})

export default async function middlewares(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext, router: Router) {
    const { middleware: routeMiddleware } = to.meta, middlewareKeys: string[] = middlewareMap.has('default') ? ['default'] : [];

    // Add route-specific middleware
    if (!isEmpty(routeMiddleware)) {
        const routeMiddlewareArray = Array.isArray(routeMiddleware) ? routeMiddleware : [routeMiddleware]
        middlewareKeys.push(...routeMiddlewareArray)
    }

    // If no middleware at all, call next and return
    if (middlewareKeys.length === 0) {
        next()
        return
    }

    try {
        for (const key of middlewareKeys) {
            const middlewareHandler = middlewareMap.get(key);

            if (!middlewareHandler) {
                console.warn(`[Route Middleware] Middleware "${key}" not found in @/middleware directory`)
                continue
            }

            await new Promise<void>((resolve, reject) => {
                try {
                    const wrappedNext: NavigationGuardNext = (toArg?: any) => {
                        if (toArg === false) {
                            reject(new Error(`[Route Middleware] Middleware "${key}" blocked navigation`))
                        } else if (toArg === true) {
                            resolve()
                        } else if (typeof toArg === 'string' || (typeof toArg === 'object' && toArg !== null)) {
                            next(toArg as RouteLocationRaw)
                            resolve()
                        } else {
                            // Middleware allowed navigation to continue - resolve to proceed to next middleware
                            resolve()
                        }
                    }
                    middlewareHandler(to, from, wrappedNext)
                } catch (error) {
                    reject(new Error(`[Route Middleware] Execution error in "${key}": ${(error as Error)?.message}`))
                }
            })
        }

        next()
    } catch (error) {
        console.error('[Route Middleware] Global execution error:', error)
        next(false)
    }
}
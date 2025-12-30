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
    const fileNameSegment = fullPath.split('/').pop();
    if (fileNameSegment && module.default) {
        const middlewareKey = fileNameSegment.replace('.ts', '');
        middlewareMap.set(middlewareKey, module.default);
    }
});

export default async function middlewares(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext, router: Router) {
    const { middleware: routeMiddleware } = to.meta

    if (isEmpty(routeMiddleware)) return;

    const middlewareKeys = Array.isArray(routeMiddleware) ? routeMiddleware : [routeMiddleware]

    for (const key of middlewareKeys) {
        const middlewareHandler = middlewareMap.get(key);

        if (middlewareHandler) {
            await new Promise<void>((resolve, reject) => {
                try {
                    const wrappedNext: NavigationGuardNext = (toArg?: any) => {
                        if (toArg === false) {
                            reject(new Error('Middleware blocked navigation'))
                        } else if (typeof toArg === 'object' || typeof toArg === 'string') {
                            router.push(toArg as RouteLocationRaw)
                            resolve()
                        } else {
                            resolve()
                        }
                    }
                    middlewareHandler(to, from, wrappedNext)
                } catch (error) {
                    reject(error)
                }
            })
        } else {
            console.warn(`Middleware "${key}" not found in middleware Folder`);
        }
    }
}
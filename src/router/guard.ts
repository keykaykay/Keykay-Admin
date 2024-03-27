import { NavigationFailureType, isNavigationFailure } from 'vue-router'
import type { Router } from 'vue-router'
import { VITE_APP_TITLE } from '@/utils/constants'
import { localCacheStorage } from '@/utils/storage'

export function useRouterGuards(router: Router) {
  const title = useTitle()
  router.beforeEach((to, from, next) => {
    if (to.path === from.path)
      return

    const token = localCacheStorage.get('token')
    if (!token) {
      if (to.path === '/login')
        return next()

      return next('/login')
    }
    if (to.path === '/login')
      return next('/')

    next()
    return true
  })

  router.afterEach((to, from, failure) => {
    if (to.path === from.path)
      return

    if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
      console.error('failed navigation', failure)
    }
    else {
      if (!to.path.includes('redirect'))
        title.value = `${to.meta.title ? ` ${to.meta.title} | ` : ''}${VITE_APP_TITLE} `
    }
  })
}

import router from '@/router'

interface IApp {
  theme: boolean
  collapsed: boolean
  model: 'left' | 'top'
  tabsList: AppRouteRecordRaw[]
  activeKey: string
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): IApp => ({
    theme: unref(useDark()),
    collapsed: false,
    model: 'left',
    tabsList: [],
    activeKey: '',
  }),
  getters: {
    menus(): AppRouteRecordRaw[] {
      let routes = router
        .getRoutes()
        .filter(route => route.meta.order && route.name)
        .sort((a, b) => Number(a.meta.order) - Number(b.meta.order))
        .map((route) => {
          route.children = []
          return route
        })
      for (let index = 0; index < routes.length; index++) {
        const route = routes[index]
        if (route.meta?.parent) {
          const findRoute = routes.find(item => item.path === route.meta.parent)
          if (findRoute) {
            route.meta.added = true
            findRoute.children = [
              ...(findRoute.children || []),
              route,
            ]
          }
        }
      }
      routes = routes.filter(route => !route.meta.added)
      return routes
    },
  },
  actions: {
    async login(_data: any) {

    },
    async logout() {
    },
    clearTab() {

    },
    deleteTab(idx: number) {},
    async addTabs(route: AppRouteRecordRaw) {},
  },
})

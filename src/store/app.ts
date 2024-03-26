import type { MenuInst, MenuOption } from 'naive-ui'
import { nanoid } from 'nanoid'
import { getMenus, handleRouteKeys, handleRouteToMenu } from '@/utils/tools'
import router from '@/router'

interface IApp {
  theme: boolean
  collapsed: boolean
  model: 'left' | 'top'
  tabsList: AppRouteTab[]
  activeKey: string
  expandedKeys: string[]
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): IApp => ({
    theme: unref(useDark()),
    collapsed: false,
    model: 'left',
    tabsList: [],
    activeKey: '',
    expandedKeys: [],
  }),
  getters: {
    menuOptions(): MenuOption[] {
      const { menuDatas } = getMenus()
      return menuDatas.map(handleRouteToMenu)
    },
  },
  actions: {
    async login(_data: any) {

    },
    async logout() {
    },
    handleMenuItemClick(key: string) {
      router.push(key)
      const keys: string[] = []
      handleRouteKeys(key.replace('/redirect', '').split('/'), keys)
      this.expandedKeys = keys
    },
    async addTabs(route: AppRouteRecordRaw) {
      if (
        !this.tabsList.some(item => item.path === route.path) && !(route.path || '').includes('/redirect')
      ) {
        this.tabsList.push({
          key: nanoid(),
          meta: route.meta,
          path: route.path,
          name: route.name,
        })
      }
      // if (this.tabsList.length === 1)
      //   this.tabsList.map(item => (item.showClose = false))

      // else
      //   this.tabsList.map(item => (item.showClose = true))
    },
    deleteTab(idx: number) {
      this.tabsList.splice(idx, 1)
      // if (this.tabsList.length === 1)
      //   this.tabsList.map(item => (item.showClose = false))
    },
    clearTab() {
      this.tabsList = []
    },
  },
  persist: true,
})

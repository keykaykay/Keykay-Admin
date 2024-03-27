import type { MenuOption } from 'naive-ui'
import { nanoid } from 'nanoid'
import dayjs from 'dayjs'
import { getMenus, handleRouteKeys, handleRouteToMenu } from '@/utils/tools'
import router from '@/router'
import { localCacheStorage } from '@/utils/storage'

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
    async login(data: ILoginForm) {
      localCacheStorage.set('token', `${data.identifier}`)
      localCacheStorage.set('user', {
        username: data.identifier,
      })
      window.$message.success('登录成功')
      setTimeout(() => {
        router.replace('/')
        window.$notification.success({
          title: data.identifier,
          content: '欢迎回来',
          description: `当前时间${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
          duration: 1500,
        })
      }, 250)
    },
    async logout() {
      window.$dialog.warning({
        title: '提示',
        content: '确定退出登录吗？',
        positiveText: '确定',
        negativeText: '取消',
        closable: false,
        closeOnEsc: false,
        maskClosable: false,
        onPositiveClick: async () => {
          this.clearTab()
          localCacheStorage.clear()
          router.replace('/login')
        },
      })
    },
    modifyPassword(payload: IModifyPassword) {
      console.warn('modifyPassword', payload)
    },
    handleMenuItemClick(key: string) {
      router.push(key)
    },

    handleMenuActiveKeyNExpandKeys(key: string) {
      this.activeKey = key
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
    },
    deleteTab(idx: number) {
      this.tabsList.splice(idx, 1)
    },
    clearTab() {
      this.tabsList = []
    },
  },
  persist: true,
})

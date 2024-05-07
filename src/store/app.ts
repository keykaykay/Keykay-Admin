import type { MenuOption } from 'naive-ui'
import { nanoid } from 'nanoid'
import dayjs from 'dayjs'
import { getMenus, handleRouteToMenu } from '@/utils/tools'
import router from '@/router'
import { localCacheStorage } from '@/utils/storage'
import { getThemeSettings } from '@/utils/settings'

interface IApp {
  collapsed: boolean
  tabsList: AppRouteTab[]
  activeKey: string
  themeSettings: App.ThemeSetting
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): IApp => ({
    collapsed: false,
    tabsList: [],
    activeKey: '',
    themeSettings: getThemeSettings(),
  }),
  getters: {
    menuOptions(): MenuOption[] {
      const { menuDatas } = getMenus()
      return menuDatas.map(handleRouteToMenu)
    },
  },
  actions: {
    updateCssVars() {
      const cssVars = this.themeSettings.cssVars
      Object.keys(cssVars).forEach((key) => {
        useCssVar(key, document.documentElement).value = cssVars[key]
      })
    },
    updateThemeSettings(val: string) {
      const originThemeSettings = this.themeSettings
      this.themeSettings = getThemeSettings(val)
      this.themeSettings.inverted = originThemeSettings.inverted
      this.themeSettings.menuMode = originThemeSettings.menuMode
      this.updateCssVars()
    },
    resetTheme() {
      this.themeSettings = getThemeSettings()
      this.updateCssVars()
      const isDark = useDark()
      isDark.value = false
    },
    async login(data: ILoginForm) {
      localCacheStorage.set('token', `${data.identifier}`)
      localCacheStorage.set('user', {
        username: data.identifier,
      })
      setTimeout(() => {
        router.replace('/')
        window.$notification.success({
          title: '登录成功',
          content: `欢迎回来，${data.identifier}`,
          duration: 1500,
        })
      }, 200)
    },
    async logout() {
      window.$dialog.info({
        title: '提示',
        content: '确定退出登录吗？',
        positiveText: '确定',
        negativeText: '取消',
        closable: false,
        closeOnEsc: false,
        maskClosable: false,
        autoFocus: false,
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
      this.activeKey = key.replace('/redirect', '')
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

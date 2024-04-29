import { createDiscreteApi, darkTheme } from 'naive-ui'
import { useAppStore } from '@/store/app'

export function useTheme() {
  const isDark = useDark()
  const appStore = useAppStore()

  const configTheme = computed(() => isDark.value ? darkTheme : null)

  const themeOverrides = computed(() => appStore.themeSettings.themeOverrides)

  appStore.updateThemeSettings(appStore.themeSettings.themeColor)

  watch(isDark, () => {
    const { message, dialog, notification, loadingBar } = createDiscreteApi(
      ['message', 'dialog', 'notification', 'loadingBar'],
      {
        configProviderProps: {
          themeOverrides: isDark.value ? appStore.themeSettings.themeOverrides : null,
          theme: isDark.value ? darkTheme : null,
        },
      },
    )

    window.$message = message
    window.$dialog = dialog
    window.$notification = notification
    window.$loading = loadingBar
  }, {
    immediate: true,
  })

  return {
    configTheme,
    themeOverrides,
  }
}
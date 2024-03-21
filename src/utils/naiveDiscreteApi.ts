import { createDiscreteApi } from 'naive-ui'
import { themeOverrides } from '@/utils/constants'

export function setupNaiveDiscreteApi() {
  const { message, dialog, notification, loadingBar } = createDiscreteApi(
    ['message', 'dialog', 'notification', 'loadingBar'],
    {
      configProviderProps: {
        themeOverrides,
      },
    },
  )

  window.$message = message
  window.$dialog = dialog
  window.$notification = notification
  window.$loading = loadingBar
}

import type { App, Directive } from 'vue'
import { createLoading } from '@/components/Loading'

type TEL = {
  instance?: ReturnType<typeof createLoading>
} & HTMLElement

const loadingDirective: Directive = {
  mounted(el: TEL, binding) {
    const instance = createLoading(
      {
        loading: !!binding.value,
      },
      el,
    )
    el.instance = instance
  },
  updated(el: TEL, binding) {
    const instance = el.instance
    if (!instance)
      return
    if (binding.oldValue !== binding.value)
      instance.setLoading?.(binding.value && !instance.loading)
  },
  unmounted(el: TEL) {
    el?.instance?.close()
  },
}

export function setupLoadingDirective(app: App) {
  app.directive('loading', loadingDirective)
}

export default loadingDirective

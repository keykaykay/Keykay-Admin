import type { AsyncComponentLoader } from 'vue'

import { NSpin } from 'naive-ui'

type TC<T> = ReturnType<AsyncComponentLoader<T>>

function noop() {}

interface Options {
  size?: 'small' | 'medium' | 'large' | number
  delay?: number
  timeout?: number
  loading?: boolean
  retry?: boolean
}

export function createAsyncComponent<
  T extends Component = {
    new (): ComponentPublicInstance
  },
>(loader: AsyncComponentLoader<T>, options: Options = {}) {
  const { size = 24, delay = 100, timeout = 30000, loading = true, retry = false } = options
  return defineAsyncComponent({
    loader: () => {
      return new Promise<TC<T>>((resolve) => {
        setTimeout(() => {
          resolve(loader())
        }, delay)
      })
    },
    loadingComponent: loading ? <div class="whf fcc"><NSpin size={size} /></div> : undefined,
    timeout,
    suspensible: true,
    delay,
    onError: !retry
      ? noop
      : (error, retry, fail, attempts) => {
          if (error.message.match(/fetch/) && attempts <= 3)
            retry()

          else
            fail()
        },
  })
}

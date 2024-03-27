import type { EChartsOption } from 'echarts'
import type { Ref } from 'vue'
import echarts from '@/utils/echarts'
import { ECHARTS_COLOR } from '@/utils/constants'
import chinaJSON from '@/assets/json/china.json'

type TTheme = 'light' | 'dark' | 'default'

export function useEcharts(
  elRef: Ref<HTMLDivElement>,
  theme: TTheme = 'light',
) {
  let chartInstance: echarts.ECharts | null = null
  let resizeFn: Fn = resize
  const cacheOptions = ref({}) as Ref<EChartsOption>
  let exposeTheme: TTheme = theme
  resizeFn = useDebounceFn(resize, 200)

  const getOptions = computed(() => cacheOptions.value as EChartsOption)

  function initCharts() {
    const el = unref(elRef)
    if (!el || !unref(el))
      return

    chartInstance = echarts.init(el, exposeTheme, { renderer: 'canvas' })
    echarts.registerMap('china', chinaJSON as any)
    useEventListener(window, 'resize', resizeFn)
  }

  function setOptions(options: EChartsOption, clear = false) {
    cacheOptions.value = {
      color: ECHARTS_COLOR,
      backgroundColor: 'transparent',
      ...options,
    }
    if (unref(elRef)?.offsetHeight === 0) {
      useTimeoutFn(() => {
        setOptions(unref(getOptions))
      }, 30)
      return
    }
    nextTick(() => {
      useTimeoutFn(() => {
        if (!chartInstance) {
          initCharts()
          if (!chartInstance)
            return
        }
        clear && chartInstance?.clear()

        chartInstance?.setOption(unref(getOptions))
        resize()
      }, 30)
    })
  }

  function resize() {
    chartInstance?.resize()
  }

  tryOnUnmounted(() => {
    if (!chartInstance)
      return

    chartInstance.dispose()
    chartInstance = null
  })

  function getInstance(): echarts.ECharts | null {
    if (!chartInstance)
      initCharts()

    return chartInstance
  }

  function reLoad(theme: TTheme = 'light') {
    chartInstance?.dispose()
    chartInstance = null
    exposeTheme = theme
    initCharts()
  }

  return {
    setOptions,
    resize,
    echarts,
    getInstance,
    reLoad,
  }
}

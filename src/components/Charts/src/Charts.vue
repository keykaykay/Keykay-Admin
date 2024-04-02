<script lang="ts" setup>
import type { Ref } from 'vue'
import type { ECElementEvent, EChartsOption } from 'echarts'
import { useEcharts } from '@/hooks/useEcharts'

interface IAutoPlayOption {
  option: string[]
  interval?: number
  loop: boolean
}

const props = withDefaults(
  defineProps<{
    option: EChartsOption
    autoPlay?: IAutoPlayOption
  }>(),
  {
  },
)

const emits = defineEmits<{
  chartClick: [payload: ECElementEvent]
}>()

const theme = useDark()

const chartRef = ref<HTMLDivElement | null>(null)
const { setOptions, getInstance, resize, reLoad } = useEcharts(
  chartRef as Ref<HTMLDivElement>,
)

const chartInstance = ref<ReturnType<typeof getInstance>>(null)

let intervalId: any = 0
let dataIndex = 0
let tooltipName = ''

function dispathChartAction(name: string) {
  chartInstance.value?.dispatchAction({
    type: 'downplay',
    seriesIndex: 0,
  })
  chartInstance.value?.dispatchAction({
    type: 'highlight',
    name,
    seriesIndex: 0,
  })
  chartInstance.value?.dispatchAction({
    type: 'showTip',
    name,
    seriesIndex: 0,
    // position: 'inside',
  })
}

watch(
  () => props.option,
  () => {
    dataIndex = 0
    setOptions(props.option)
  },
  {
    immediate: true,
    deep: true,
  },
)

function handleChartInstanceEvent() {
  dataIndex = 0
  chartInstance.value = getInstance()
  chartInstance.value?.on('click', (params: any) => {
    emits('chartClick', params)
  })
  if (props.autoPlay?.loop) {
    clearInterval(intervalId)
    const loopData = props.autoPlay.option
    if (loopData.length === 0)
      return

    intervalId = setInterval(() => {
      if (dataIndex >= loopData.length)
        dataIndex = 0

      tooltipName = loopData[dataIndex]
      dispathChartAction(tooltipName)
      dataIndex++
    }, props.autoPlay?.interval || 3000)
    chartInstance.value?.on('mouseover', (payload) => {
      clearInterval(intervalId)
      dispathChartAction(payload.name)
    })
    chartInstance.value?.on('mouseout', () => {
      clearInterval(intervalId)
      intervalId = setInterval(() => {
        if (dataIndex >= loopData.length)
          dataIndex = 0

        tooltipName = loopData[dataIndex]
        dispathChartAction(tooltipName)
        dataIndex++
      }, props.autoPlay?.interval || 3000)
    })
    tryOnUnmounted(() => {
      clearInterval(intervalId)
    })
  }
}

watch([theme], () => {
  reLoad(theme.value ? 'dark' : 'light')
  setOptions(props.option)
  handleChartInstanceEvent()
}, {
  immediate: true,
})

onMounted(() => {
  handleChartInstanceEvent()
})

defineExpose({ resize })
</script>

<template>
  <div class="h-full w-full">
    <div ref="chartRef" class="h-full w-full" />
  </div>
</template>

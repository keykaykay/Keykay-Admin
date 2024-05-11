<script lang="tsx" setup>
import type { EChartsOption } from 'echarts'
import * as echarts from 'echarts'
import { localCacheStorage } from '@/utils/storage'
import Charts from '@/components/Charts'
import 'echarts-wordcloud'
import KjImage from '@/assets/images/keji.jpg'

const user = computed(() => localCacheStorage.get<ILoginUserResult>('user'))

const chartsOption1 = computed(() => ({
  color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985',
      },
    },
  },
  legend: {
    data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'],
    show: false,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
  ],
  yAxis: [
    {
      type: 'value',
    },
  ],
  series: [
    {
      name: 'Line 1',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(128, 255, 165)',
          },
          {
            offset: 1,
            color: 'rgb(1, 191, 236)',
          },
        ]),
      },
      emphasis: {
        focus: 'series',
      },
      data: [140, 232, 101, 264, 90, 340, 250],
    },
    {
      name: 'Line 2',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(0, 221, 255)',
          },
          {
            offset: 1,
            color: 'rgb(77, 119, 255)',
          },
        ]),
      },
      emphasis: {
        focus: 'series',
      },
      data: [120, 282, 111, 234, 220, 340, 310],
    },
    {
      name: 'Line 3',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(55, 162, 255)',
          },
          {
            offset: 1,
            color: 'rgb(116, 21, 219)',
          },
        ]),
      },
      emphasis: {
        focus: 'series',
      },
      data: [320, 132, 201, 334, 190, 130, 220],
    },
    {
      name: 'Line 4',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(255, 0, 135)',
          },
          {
            offset: 1,
            color: 'rgb(135, 0, 157)',
          },
        ]),
      },
      emphasis: {
        focus: 'series',
      },
      data: [220, 402, 231, 134, 190, 230, 120],
    },
    {
      name: 'Line 5',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      label: {
        show: true,
        position: 'top',
      },
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(255, 191, 0)',
          },
          {
            offset: 1,
            color: 'rgb(224, 62, 76)',
          },
        ]),
      },
      emphasis: {
        focus: 'series',
      },
      data: [220, 302, 181, 234, 210, 290, 150],
    },
  ],
} as EChartsOption))
const chartsOption2 = computed(() => ({
  tooltip: {
    trigger: 'item',
  },
  legend: {
    bottom: '1%',
    left: 'center',
    itemStyle: {
      borderWidth: 0,
    },
  },
  series: [
    {
      color: ['#5da8ff', '#8e9dff', '#fedc69', '#26deca'],
      name: '作息',
      type: 'pie',
      radius: ['45%', '75%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 1,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '12',
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { name: '学习', value: 20 },
        { name: '娱乐', value: 10 },
        { name: '工作', value: 40 },
        { name: '休息', value: 30 },
      ],
    },
  ],
} as EChartsOption))
const chartsOption3 = computed(() => ({ // 指定图表的配置项和数据
  tooltip: { show: true }, // 配置提示框组件
  series: [{ // 数据系列及其配置
    name: '全球编程语言的TIOBE排名', // 设置名称
    type: 'wordCloud', // 设置图表类型为字云图
    sizeRange: [15, 100], // 设置数据大小范围
    size: ['80%', '80%'], // 设置显示的字云图的大小
    textRotation: [0, 45, 90, 135, -45, -90], // 设置文字倾斜角度
    textPadding: 3, // 设置文字之间的间距
    autoSize: { enable: true, minSize: 5 }, // 设置文字的自动大小
    textStyle: {
      normal: {
        color() {
          return `rgb(${[
								Math.round(Math.random() * 255),
								Math.round(Math.random() * 255),
								Math.round(Math.random() * 255),
							].join(',')})`
        },
      },
      emphasis: {
        shadowBlur: 26,
        color: '#333',
        shadowColor: '#ccc',
        fontSize: 20,
      },
    },
    data: [
      { name: 'Java', value: 16884 },
      { name: 'C', value: 16180 },
      { name: 'Python', value: 9089 },
      { name: 'C++', value: 6229 },
      { name: 'C#', value: 3860 },
      { name: 'VB.NET', value: 3745 },
      { name: 'Ruby', value: 1318 },
      { name: 'Assembly', value: 1307 },
      { name: 'R', value: 1261 },
      { name: 'Delphi', value: 1046 },
      { name: 'VB', value: 1234 },
      { name: 'Go', value: 1100 },
      { name: 'Delphi', value: 1046 },
      { name: 'SAS', value: 915 },
      { name: 'Perl', value: 1023 },
      { name: 'Matlab', value: 924 },
      { name: 'PL/SQL', value: 822 },
      { name: 'D', value: 814 },
      { name: 'Scheme', value: 193 },
      { name: 'COBEL', value: 447 },
      { name: 'Scratch', value: 524 },
      { name: 'Dart', value: 448 },
      { name: 'ABAP', value: 447 },
      { name: 'Scala', value: 442 },
      { name: 'Fortran', value: 439 },
      { name: 'LiveCode', value: 169 },
      { name: 'Lisp', value: 409 },
      { name: 'F#', value: 391 },
      { name: 'Rust', value: 356 },
      { name: 'Kotlin', value: 319 },
      { name: 'Ada', value: 316 },
      { name: 'Logo', value: 261 },
      { name: 'SQL', value: 1935 },
      { name: 'RPG', value: 274 },
      { name: 'PHP', value: 1909 },
      { name: 'LabVIEW', value: 243 },
      { name: 'Haskell', value: 209 },
      { name: 'Bash', value: 196 },
      { name: 'ActionScript', value: 182 },
      { name: 'Transact-SQL', value: 569 },
      { name: 'PowerShell', value: 178 },
      { name: 'VBScript', value: 203 },
      { name: 'JavaScript', value: 2076 },
      { name: 'TypeScript', value: 304 },
      { name: 'Objective-C', value: 1501 },
      { name: 'Prolog', value: 261 },
      { name: 'Groovy', value: 1394 },
      { name: 'Swift', value: 1362 },
      { name: 'Crystal', value: 168 },
      { name: 'Lua', value: 379 },
      { name: 'Julia', value: 224 },
    ],
  }],
} as EChartsOption))
/**
 *



 */
</script>

<template>
  <div class="whf flex flex-col gap-4">
    <n-card hoverable>
      <div class="flex flex-wrap items-center justify-between">
        <div class="w-full flex items-center md:flex-1">
          <n-avatar
            round
            :size="64"
            src="https://picsum.photos/200"
          />
          <div class="ml-4 flex flex-col">
            <span class="text-18px font-semibold">早安，{{ user?.username }}, 今天又是充满活力的一天!</span>
            <span class="text-#999 leading-30px">今日多云转晴，20℃ - 25℃!</span>
          </div>
        </div>
        <div class="w-full flex items-center justify-end gap-4 md:flex-1">
          <div class="fcc flex-col">
            <span class="text-sm text-#999">项目数量</span>
            <span class="text-xl">25</span>
          </div>
          <div class="fcc flex-col">
            <span class="text-sm text-#999">待办数量</span>
            <span class="text-xl">4/16</span>
          </div>
          <div class="fcc flex-col">
            <span class="text-sm text-#999">消息数量</span>
            <span class="text-xl">12</span>
          </div>
        </div>
      </div>
    </n-card>
    <n-card hoverable>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div class="h-24 flex flex-col justify-around rounded-2 from-#ec4786 to-#b955a4 bg-gradient-to-br p-2 text-white">
          <div class="text-xl">
            访问量
          </div>
          <div class="flex items-center justify-between">
            <div class="i-mdi:chart-bar text-3xl color-white" />
            <n-number-animation
              show-separator
              :from="0"
              :to="9725"
            />
          </div>
        </div>
        <div class="h-24 flex flex-col justify-around rounded-2 from-#865ec0 to-#5144b4 bg-gradient-to-br p-2 text-white">
          <div class="text-xl">
            成交额
          </div>
          <div class="flex items-center justify-between">
            <div class="i-mdi:monitor-eye text-3xl color-white" />
            <div>
              ¥<n-number-animation
                show-separator
                :from="0"
                :to="125369"
              />
            </div>
          </div>
        </div>
        <div class="h-24 flex flex-col justify-around rounded-2 from-#56cdf3 to-#719de3 bg-gradient-to-br p-2 text-white">
          <div class="text-xl">
            下载量
          </div>
          <div class="flex items-center justify-between">
            <div class="i-mdi:box-download text-3xl color-white" />
            <n-number-animation
              show-separator
              :from="0"
              :to="987258"
            />
          </div>
        </div>
        <div class="h-24 flex flex-col justify-around rounded-2 from-#fcbc25 to-#f68057 bg-gradient-to-br p-2 text-white">
          <div class="text-xl">
            成交量
          </div>
          <div class="flex items-center justify-between">
            <div class="i-mdi:alpha-r-circle-outline text-3xl color-white" />
            <n-number-animation
              show-separator
              :from="0"
              :to="12564"
            />
          </div>
        </div>
      </div>
    </n-card>
    <n-card hoverable content-style="padding: 0">
      <div class="h-100 w-full">
        <Charts class="whf" :option="chartsOption1" />
      </div>
    </n-card>
    <div class="grid grid-cols-1 w-full gap-6 lg:grid-cols-3">
      <n-card hoverable title="作息安排" content-style="padding: 0">
        <div class="h-100 w-full">
          <Charts class="whf" :option="chartsOption2" />
        </div>
      </n-card>
      <n-card hoverable title="全球编程语言的TIOBE排名" content-style="padding: 0">
        <div class="h-100 w-full">
          <Charts class="whf" :option="chartsOption3" />
        </div>
      </n-card>
      <n-card hoverable title="科技前沿" content-style="padding: 0">
        <div class="h-100 w-full fcc overflow-hidden">
          <n-image height="100%" width="100%" object-fit="scale-down" :src="KjImage" preview-disabled />
        </div>
      </n-card>
    </div>
  </div>
</template>

<route lang="json5">
{
  meta: {
    title: '首页',
    icon: 'i-mdi:desktop-mac-dashboard',
    order: 1
  }
}
</route>

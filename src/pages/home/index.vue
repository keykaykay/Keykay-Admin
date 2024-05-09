<script lang="tsx" setup>
import { localCacheStorage } from '@/utils/storage'

const user = computed(() => localCacheStorage.get<ILoginUserResult>('user'))
</script>

<template>
  <div class="whf">
    <n-card>
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
    <n-card
      class="mt-4"
    >
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

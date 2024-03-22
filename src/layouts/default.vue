<script lang="ts" setup>
import { useAppStore } from '@/store/app'

const wrapRef = ref<HTMLElement>()

const route = useRoute()
const appStore = useAppStore()

// watch(() => route.path, () => {
//   appStore.activeKey = route.path
// }, {
//   immediate: true,
// })
</script>

<template>
  <n-layout
    ref="wrapRef"
    class="h-full"
    :content-style="{
      display: 'flex',
      width: '100%',
      height: '100%',
    }"
    has-sider
  >
    <LayoutSider />
    <n-layout
      class="h-full flex-1"
      :content-style="{
        display: 'flex',
        flexDirection: 'column',
      }"
    >
      <LayoutHeader :wrap-ref="wrapRef" />
      <LayoutTab />
      <n-layout-content
        class="scrollBar flex-1 overflow-y-auto"
        :content-style="{
          overflow: 'hidden',
        }"
      >
        <router-view v-slot="{ Component }">
          <transition
            name="fade"
            enter-active-class="animate__animated animate__fadeIn"
            leave-active-class="animate__animated animate__fadeOut"
            appear
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

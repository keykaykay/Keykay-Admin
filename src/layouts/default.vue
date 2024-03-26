<script lang="ts" setup>
import { useAppStore } from '@/store/app'

const wrapRef = ref<HTMLElement>()

const appStore = useAppStore()
const route = useRoute()

watch(route, () => {
  appStore.activeKey = route.path
}, {
  immediate: true,
  deep: true,
})
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
        class="flex-1 p-4"
        :native-scrollbar="false"
        :scrollbar-props="{
          xScrollable: true,
        }"
      >
        <router-view v-slot="{ Component }">
          <transition
            name="fade"
            enter-active-class="animate__animated animate__fadeInRight"
            appear
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

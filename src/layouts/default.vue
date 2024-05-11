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
      <LayoutTab v-if="appStore.themeSettings.showTabBar" />
      <n-layout-content
        class="flex-1 p-2"
        :native-scrollbar="false"
        :content-style="{
          maxHeight: '100%',
          height: '100%',
        }"
      >
        <router-view v-slot="{ Component }" :key="appStore.refreshKey">
          <transition
            name="fade"
            mode="out-in"
            :enter-active-class="`animate__animated ${appStore.themeSettings.animateType}`"
            appear
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </n-layout-content>
      <LayoutFooter v-if="appStore.themeSettings.showFooter" />
    </n-layout>
  </n-layout>
</template>

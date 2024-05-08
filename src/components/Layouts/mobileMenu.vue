<script lang="ts" setup>
import LeftMenu from './leftMenu.vue'
import { useAppStore } from '@/store/app'

defineProps<{
  mobileDrawer: boolean
  closeDrawerEvent: () => void
}>()

const appStore = useAppStore()
</script>

<template>
  <n-drawer
    :show="mobileDrawer"
    :on-update-show="closeDrawerEvent"
    :width="210"
    placement="left"
  >
    <n-layout-sider
      class="h-full"
      :content-style="{
        height: '100%',
      }"
      :inverted="appStore.themeSettings.inverted"
      width="100%"
      bordered
      collapse-mode="width"
      :native-scrollbar="false"
      :show-trigger="false"
      :show-collapsed-content="false"
    >
      <LeftMenu />
    </n-layout-sider>
  </n-drawer>
</template>

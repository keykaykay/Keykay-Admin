<script lang="ts" setup>
import LeftMenu from './leftMenu.vue'

import { useMobile } from '@/hooks/useDevice'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const { isMobile } = useMobile()
</script>

<template>
  <n-layout-sider
    v-if="appStore.model === 'left' && !isMobile"
    :content-style="{
      height: '100%',
    }"
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :width="210"
    :native-scrollbar="false"
    :collapsed="appStore.collapsed"
    :show-trigger="false"
    :show-collapsed-content="false"
    @collapse="appStore.collapsed = true"
    @expand="appStore.collapsed = false"
  >
    <LeftMenu />
  </n-layout-sider>
</template>

<script lang="ts" setup>
import LeftMenu from './leftMenu.vue'

defineProps<{
  mobileDrawer: boolean
  closeDrawerEvent: () => void
}>()
</script>

<template>
  <n-drawer
    :show="mobileDrawer"
    :on-update-show="closeDrawerEvent"
    :width="210"
    placement="left"
  >
    <n-drawer-content
      :body-content-style="{
        padding: '0',
        backgroundColor: '#021428',
      }"
    >
      <LeftMenu />
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
import { NMenu } from 'naive-ui'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
</script>

<template>
  <div class="h-full flex items-center justify-center">
    <NMenu
      mode="horizontal"
      responsive
      :options="appStore.menuOptions"
      :value="appStore.activeKey"
      @update:value="(key) => appStore.handleMenuItemClick(key)"
    />
  </div>
</template>

<style scoped>
:deep(.n-menu.n-menu--horizontal.n-menu--responsive .v-overflow) {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

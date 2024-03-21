<script setup lang="ts">
import { darkTheme, dateZhCN, zhCN } from 'naive-ui'
import { useAppStore } from '@/store/app'
import { themeOverrides } from '@/utils/constants'

const appStore = useAppStore()
const theme = computed(() => (appStore.theme ? darkTheme : null))
</script>

<template>
  <n-config-provider
    :abstract="true"
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme-overrides="themeOverrides"
    :theme="theme"
  >
    <AppProvider>
      <router-view />
    </AppProvider>
  </n-config-provider>
</template>

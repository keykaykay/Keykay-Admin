<script setup lang="ts">
import { darkTheme, dateZhCN, zhCN } from 'naive-ui'
import { themeOverrides } from '@/utils/constants'

const isDark = useDark()
const theme = computed(() => isDark.value ? darkTheme : null)
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

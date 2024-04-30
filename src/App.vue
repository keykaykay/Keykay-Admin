<script setup lang="ts">
import { dateZhCN, zhCN } from 'naive-ui'
import { useTheme } from '@/hooks/useTheme'

const { configTheme, themeOverrides } = useTheme()
</script>

<template>
  <n-config-provider
    :abstract="true"
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme-overrides="themeOverrides"
    :theme="configTheme"
  >
    <AppProvider>
      <RouterView />
    </AppProvider>
  </n-config-provider>
</template>

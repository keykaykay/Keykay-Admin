<script lang="ts" setup>
import { useAppStore } from '@/store/app'

// 切换主题
const isDark = useDark()
const appStore = useAppStore()

function toggleDark() {
  isDark.value = !isDark.value
  appStore.theme = unref(isDark)
}
</script>

<template>
  <div :class="`theme ${isDark ? 'theme--dark' : ''}`" @click="toggleDark">
    <div class="theme-inner" />
    <div class="i-mdi:weather-sunny text-yellow" />
    <div class="i-mdi:weather-night text-red" />
  </div>
</template>

<style lang="scss" scoped>
  html[data-theme='dark'] {
    .theme {
      border: 1px solid rgb(196 188 188);
    }
  }

  .theme {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: space-between;
    width: 50px;
    height: 26px;
    margin-left: auto;
    padding: 0 6px;
    border-radius: 30px;
    background-color: #151515;
    cursor: pointer;

    &-inner {
      position: absolute;
      z-index: 1;
      width: 18px;
      height: 18px;
      transition:
        transform 0.5s,
        background-color 0.5s;
      border-radius: 50%;
      background-color: #fff;
      will-change: transform;
    }

    &--dark {
      .theme-inner {
        transform: translateX(calc(100% + 2px));
      }
    }
  }
</style>

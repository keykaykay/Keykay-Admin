<script lang="ts" setup>
import { primaryColor } from '@/utils/constants'

// 切换主题
const isDark = useDark()

function toggleDark() {
  isDark.value = !isDark.value
}

function toggleTheme(event: MouseEvent) {
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )

  // 兼容性处理
  if (!document.startViewTransition) {
    toggleDark()
    return
  }
  const transition = document.startViewTransition(async () => {
    toggleDark()
  })

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]
    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 400,
        easing: 'ease-in',
        pseudoElement: isDark.value
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    )
  })
}
</script>

<template>
  <div>
    <n-popover trigger="hover">
      <template #trigger>
        <div
          class="cursor-pointer text-2xl"
          :class="[
            isDark ? 'i-mdi:weather-night' : 'i-mdi:weather-sunny',
          ]"
          @click="toggleTheme"
        />
      </template>
      <n-grid :cols="1">
        <n-gi
          class="flex cursor-pointer items-center p-2" :class="[
            !isDark ? `text-white bg-${primaryColor} hover:text-white` : `hover:text-${primaryColor}`,
          ]"
          @click="toggleTheme"
        >
          <div class="i-mdi:weather-sunny mr-1" />
          <div>浅色模式</div>
        </n-gi>
        <n-gi
          class="flex cursor-pointer items-center p-2" :class="[
            isDark ? `text-white bg-${primaryColor} hover:text-white` : `hover:text-${primaryColor}`,
          ]"
          @click="toggleTheme"
        >
          <div class="i-mdi:weather-night mr-1" />
          <div>深色模式</div>
        </n-gi>
      </n-grid>
    </n-popover>
  </div>
</template>

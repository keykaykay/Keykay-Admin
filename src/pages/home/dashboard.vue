<script lang="ts" setup>
const isDark = useDark()
const test = ref(false)
</script>

<template>
  <div class="relative w-full transition-300 transition-all" :class="[isDark ? 'h-50 bg-red' : 'h-100 bg-yellow']" @click="() => test = !test">
    dashboard
  </div>
</template>

<route lang="json5">
  {
    meta: {
      title: 'dashboard',
    }
  }
  </route>

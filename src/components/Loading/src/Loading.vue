<script lang="ts" setup>
withDefaults(defineProps<{
  loading: boolean
}>(), {
  loading: true,
})
</script>

<template>
  <div v-if="loading" class="absolute left-0 top-0 z-10 h-full w-full flex items-center justify-center bg-white dark:bg-#18181c bg-opacity-80!">
    <div class="i-mdi-light:loading animate-spin text-5xl text-[var(--k-primary-color)]" />
  </div>
</template>

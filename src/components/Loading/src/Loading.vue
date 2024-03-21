<script lang="ts" setup>
import { secondaryColor } from '@/utils/constants'
withDefaults(defineProps<{
  loading: boolean
}>(), {
  loading: true,
})
</script>

<template>
  <div v-if="loading" class="absolute left-0 top-0 w-full h-full bg-white dark:bg-#18181c bg-opacity-80! z-10 flex justify-center items-center">
    <div :class="`i-mdi-light:loading animate-spin text-5xl color-${secondaryColor}`" />
  </div>
</template>

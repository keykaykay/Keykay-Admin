<script lang="ts" setup>
import NotFoundPage from '@/assets/images/404.svg'

const router = useRouter()
</script>

<template>
  <div class="h-full w-full flex items-center justify-center">
    <n-empty :show-icon="false" size="huge">
      <template #extra>
        <n-button type="primary" @click="router.push('/')">
          返回首页
        </n-button>
      </template>
      <template #icon />
      <div>
        <n-image preview-disabled :src="NotFoundPage" width="400" />
        <div class="mt-3 text-center">
          对不起，您访问的页面不存在
        </div>
      </div>
    </n-empty>
  </div>
</template>

<route lang="yaml">
meta:
  title: 空页面
  whiteList: true
</route>

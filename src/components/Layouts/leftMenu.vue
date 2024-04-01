<script lang="ts" setup>
import type { MenuInst } from 'naive-ui'
import { NMenu } from 'naive-ui'
import { useAppStore } from '@/store/app'
import { VITE_APP_TITLE } from '@/utils/constants'
import { useMobile } from '@/hooks/useDevice'

const menuInstRef = ref<MenuInst | null>(null)
const router = useRouter()
const appStore = useAppStore()
const { isMobile } = useMobile()

const refreshExpand = computed(() => appStore.activeKey)
watch(refreshExpand, () => {
  menuInstRef.value?.showOption(appStore.activeKey)
}, {
  immediate: true,
})
</script>

<template>
  <div class="h-full w-full text-white">
    <div
      class="h-12 flex cursor-pointer items-center justify-center gap-4"
      @click="router.push('/')"
    >
      <n-icon size="20">
        <img class="h-full w-full scale-260 object-cover" src="@/assets/images/logo.svg" alt="logo">
      </n-icon>
      <transition
        enter-active-class="animate__animated animate__flipInX"
        appear
      >
        <div v-show="!appStore.collapsed || isMobile" class="mt-1 text-base">
          {{ VITE_APP_TITLE }}
        </div>
      </transition>
    </div>
    <NMenu
      ref="menuInstRef"
      inverted
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :indent="30"
      :root-indent="10"
      :options="appStore.menuOptions"
      accordion
      :value="appStore.activeKey"
      @update:value="(key) => appStore.handleMenuItemClick(key)"
    />
  </div>
</template>

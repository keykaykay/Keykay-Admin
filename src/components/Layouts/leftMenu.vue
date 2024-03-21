<script lang="ts" setup>
import type { MenuOption } from 'naive-ui'
import { NMenu } from 'naive-ui'
import { handleRouteToMenu } from '@/utils/tools'
import { useAppStore } from '@/store/app'
import { VITE_APP_TITLE } from '@/utils/constants'
import { useMobile } from '@/hooks/useDevice'

const router = useRouter()
const appStore = useAppStore()
const { isMobile } = useMobile()

const menuOptions = computed<MenuOption[]>(() =>
  appStore.menus.map(handleRouteToMenu),
)

const expandedKeys = ref<string[]>([])

watch(
  () => appStore.activeKey,
  (val) => {
    const path = `/${val.split('/')[1]}`
    expandedKeys.value = [path]
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div class="h-full w-full color-white">
    <div
      class="h-12 flex cursor-pointer items-center justify-center"
      @click="router.push('/')"
    >
      <n-icon size="40">
        <img class="h-full w-full" src="@/assets/images/logo.svg" alt="logo">
      </n-icon>
      <transition
        enter-active-class="animate__animated animate__flipInX"
        appear
      >
        <div v-show="!appStore.collapsed || isMobile" class="ml-2 mt-1 text-base">
          {{ VITE_APP_TITLE }}
        </div>
      </transition>
    </div>
    <NMenu
      inverted
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      :value="appStore.activeKey"
      :expanded-keys="expandedKeys"
    />
  </div>
</template>

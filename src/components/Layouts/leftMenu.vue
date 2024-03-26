<script lang="ts" setup>
import { NMenu } from 'naive-ui'
import { useAppStore } from '@/store/app'
import { VITE_APP_TITLE } from '@/utils/constants'
import { useMobile } from '@/hooks/useDevice'
import { getMenus } from '@/utils/tools'

const { menuDatas } = getMenus()
const router = useRouter()
const appStore = useAppStore()
const { isMobile } = useMobile()

// 查找是否存在子路由
function findChildrenLen(key: string) {
  if (!key)
    return false
  const subRouteChildren: string[] = []
  for (const { children, key } of unref(menuDatas)) {
    if (children && children.length)
      subRouteChildren.push(key as string)
  }
  return subRouteChildren.includes(key)
}

function handleExpandedKeys(openKeys: string[]) {
  if (!openKeys)
    return
  const latestOpenKey = openKeys.find(key => !appStore.expandedKeys.includes(key))
  const isExistChildren = findChildrenLen(latestOpenKey as string)
  appStore.expandedKeys = isExistChildren ? (latestOpenKey ? [latestOpenKey] : []) : openKeys
}
</script>

<template>
  <div class="h-full w-full text-white">
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
      :indent="30"
      :root-indent="30"
      :options="appStore.menuOptions"
      accordion
      :value="appStore.activeKey"
      :expanded-keys="appStore.expandedKeys"
      @update:value="(key) => appStore.handleMenuItemClick(key)"
      @update:expanded-keys="handleExpandedKeys"
    />
  </div>
</template>

<style>
.n-menu-item-content.n-menu-item-content--selected {
  /* background-color: #1e90ffFF; */
  /* color: #fff; */
}
</style>

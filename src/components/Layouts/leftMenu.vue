<script lang="ts" setup>
import type { MenuOption } from 'naive-ui'
import { NMenu } from 'naive-ui'
import { getMenus, handleRouteToMenu } from '@/utils/tools'
import { useAppStore } from '@/store/app'
import { VITE_APP_TITLE } from '@/utils/constants'
import { useMobile } from '@/hooks/useDevice'

const { menuDatas, rawDatas } = getMenus()
const router = useRouter()
const appStore = useAppStore()
const { isMobile } = useMobile()
console.log(menuDatas)
const menuOptions = computed<MenuOption[]>(() =>
  // appStore.menus.map(handleRouteToMenu),
  menuDatas.map(handleRouteToMenu),
)

console.log(menuOptions.value)

function handleMenuClick(key: string, item: MenuOption) {
  // if (item.children) return
  // appStore.activeKey = key
  router.push(key)
}

const expandedKeys = ref<string[]>([])

watch(
  () => appStore.activeKey,
  (val) => {
    // const path = `/${val.split('/')[1]}`
    // expandedKeys.value = [path]
  },
  {
    immediate: true,
  },
)

const route = useRoute()
watch(route, () => {
  const target = rawDatas.find(item => item.name === route.name)
  if (target) {
    // expandedKeys.value = [target.path as string]
    appStore.activeKey = target.path as string
    // appStore.selectedKeys = [route.name as string]
    const paths = target.paths! as string[]
    expandedKeys.value = [paths.slice(0, paths.length - 1).join('/')]
    console.log(expandedKeys.value)
  }
}, {
  immediate: true,
  deep: true,
})
</script>

<template>
  <div class="h-full w-full">
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
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      :value="appStore.activeKey"
      :expanded-keys="expandedKeys"
      :on-update:expanded-keys="(keys: string[]) => {
        console.log(keys)
        expandedKeys = keys
      }"
      :on-update:value="(key: string, item: MenuOption) => handleMenuClick(key, item)"
    />
  </div>
</template>

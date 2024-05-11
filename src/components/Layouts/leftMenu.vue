<script lang="ts" setup>
import type { MenuInst } from 'naive-ui'
import { NMenu } from 'naive-ui'
import { useAppStore } from '@/store/app'
import { VITE_APP_TITLE } from '@/utils/constants'
import { useMobile } from '@/hooks/useDevice'
import { getFlatMenus } from '@/utils/tools'

const flatMenus = getFlatMenus()
const menuInstRef = ref<MenuInst | null>(null)
const router = useRouter()
const appStore = useAppStore()
const { isMobile } = useMobile()
const isDark = useDark()
const inverted = computed(() => appStore.themeSettings.inverted)
const titleColorStatus = computed(() => appStore.themeSettings.inverted || isDark.value)
const refreshExpand = computed(() => appStore.activeKey)
watch(refreshExpand, () => {
  menuInstRef.value?.showOption(appStore.activeKey)
}, {
  immediate: true,
})

const route = useRoute()
const defaultExpandedKeys = ref<string[]>([])
function handleDefaultExpandKeys() {
  const targetItem = flatMenus.find(item => item.path === route.path)

  if (!targetItem)
    return

  const paths = targetItem.pid!.split('/')

  const res: string[] = []
  function run(arr: string[]) {
    res.push(arr.join('/'))
    arr.pop()
    if (arr.length > 0)
      run(arr)
  }

  run(paths)

  defaultExpandedKeys.value = res.filter(Boolean)
}
handleDefaultExpandKeys()

function handleItemClick(key: string) {
  const targetItem = flatMenus.find(item => item.path === key)!
  if (targetItem.pid === '/')
    defaultExpandedKeys.value = []

  appStore.handleMenuItemClick(key)
}
function handleExpandedKeys(keys: string[]) {
  if (keys.length > 0) {
    const lastKey = keys.pop()!
    const idx = keys.findIndex(item => lastKey.includes(item))
    if (idx === -1)
      keys = [lastKey]
    else
      keys.push(lastKey)

    defaultExpandedKeys.value = keys
  }
}
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
        <div v-show="!appStore.collapsed || isMobile" :class="`mt-1 text-base ${(titleColorStatus) ? 'text-white' : 'text-black'}`">
          {{ VITE_APP_TITLE }}
        </div>
      </transition>
    </div>
    <NMenu
      ref="menuInstRef"
      :inverted="inverted"
      :default-expanded-keys="defaultExpandedKeys"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :indent="28"
      :root-indent="14"
      :options="appStore.menuOptions"
      accordion
      :value="appStore.activeKey"
      :watch-props="['defaultExpandedKeys']"
      @update:value="handleItemClick"
      @update:expanded-keys="handleExpandedKeys"
    />
  </div>
</template>

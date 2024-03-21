<script lang="ts" setup>
import { type MenuOption, NMenu } from 'naive-ui'
import { useAppStore } from '@/store/app'
import { handleRouteToMenu } from '@/utils/tools'

const router = useRouter()
const appStore = useAppStore()
const menuRef = ref<HTMLDivElement>()
const resultMenu = ref<MenuOption[]>([])

function handleChangeMenu(key: string) {
  router.push(key)
}

useResizeObserver(menuRef, (entries) => {
  const entry = entries[0]
  const { width } = entry.contentRect
  const moreItemWidth = 60
  const normalItemWidth = 140
  const wrapWidth = width - moreItemWidth
  const itemCount = Math.floor(wrapWidth / normalItemWidth)
  resultMenu.value = []
  const menus: MenuOption[] = []
  const minCount = Math.min(itemCount, appStore.menus.length)
  for (let index = 0; index < minCount; index++) {
    const menuRaw = appStore.menus[index]
    const menu = handleRouteToMenu(menuRaw)
    menus.push(menu)
  }
  resultMenu.value = menus

  if (itemCount < appStore.menus.length) {
    const otherItems: MenuOption[] = []
    for (let index = itemCount; index < appStore.menus.length; index++) {
      const menuRaw = appStore.menus[index]
      otherItems.push(handleRouteToMenu(menuRaw))
    }
    resultMenu.value.push({
      key: 'more',
      label: () =>
        h('div', { class: 'w-40px text-2xl i-material-symbols:more-horiz' }),
      children: otherItems,
    })
  }
})
</script>

<template>
  <NMenu
    ref="menuRef"
    class="h-full flex items-center justify-center"
    mode="horizontal"
    :options="resultMenu"
    :value="appStore.activeKey"
    @update:value="handleChangeMenu"
  />
</template>

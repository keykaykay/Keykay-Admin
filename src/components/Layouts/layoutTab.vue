<script lang="ts" setup>
import { VueDraggable } from 'vue-draggable-plus'
import { useAppStore } from '@/store/app'
import { renderIcon } from '@/utils/tools'

const appStore = useAppStore()
const route = useRoute()
const draggableRef = ref<any>()
const showScrollButton = ref(false)
const tabListItemWidth = 110
const x = ref(0)
const y = ref(0)
const showDropdown = ref(false)
let ctxTabItem: AppRouteTab = { key: '' }
const options = [
  {
    label: '刷新当前',
    key: '1',
    icon: renderIcon('i-ep:refresh-right'),
  },
  {
    label: '关闭当前',
    key: '2',
    icon: renderIcon('i-ep:close'),
  },
  {
    label: '关闭其它',
    key: '3',
    icon: renderIcon('i-ant-design:column-width-outlined'),
  },
  {
    label: '关闭全部',
    key: '4',
    icon: renderIcon('i-ic:baseline-minus'),
  },
]

function handleScrollEvent(direction: 'left' | 'right') {
  draggableRef.value?.$el.scrollBy({
    top: 0,
    left: direction === 'left' ? tabListItemWidth : -tabListItemWidth,
    behavior: 'smooth',
  })
}

function tabsEvent(element: AppRouteTab) {
  appStore.handleMenuItemClick(element.path || '')
}

function handleContextMenu(e: MouseEvent, el: AppRouteTab) {
  e.preventDefault()
  showDropdown.value = true
  nextTick().then(() => {
    showDropdown.value = true
    x.value = e.clientX
    y.value = e.clientY
  })
  ctxTabItem = el
}

function tabsDeleteEvent(element: AppRouteTab) {
  if (appStore.tabsList.length === 1)
    return
  const idx = appStore.tabsList.findIndex(item => item.path === element.path)
  appStore.deleteTab(idx)
  if (appStore.activeKey === element.path)
    appStore.handleMenuItemClick(appStore.tabsList[idx - 1 < 0 ? 0 : idx - 1].path || '')
}

function onClickoutside() {
  showDropdown.value = false
}

function handleSelect(key: string | number) {
  showDropdown.value = false
  switch (key) {
    case '1':
      appStore.handleMenuItemClick(`/redirect${ctxTabItem.path}`)
      break
    case '2':
      tabsDeleteEvent(ctxTabItem)
      break
    case '3':
      appStore.tabsList = [ctxTabItem]
      appStore.handleMenuItemClick(`/redirect${ctxTabItem.path}`)
      break
    case '4':
      appStore.tabsList = []
      appStore.handleMenuItemClick(`/redirect/home`)
      break
    default:
      break
  }
}

watch(
  () => route,
  async (to) => {
    await appStore.addTabs(to)
    showScrollButton.value
      = draggableRef.value?.$el.scrollWidth > draggableRef.value?.$el.offsetWidth
  },
  {
    deep: true,
    immediate: true,
  },
)
</script>

<template>
  <n-layout-header
    class="mb-1 h-9 w-full flex items-center shadow dark:shadow-slate-700"
  >
    <n-icon
      v-show="showScrollButton"
      class="i-material-symbols:chevron-left cursor-pointer text-3xl"
      @click="handleScrollEvent('left')"
    />
    <VueDraggable v-model="appStore.tabsList" class="h-full flex flex-1 items-center overflow-hidden">
      <template v-for="element in appStore.tabsList" :key="element.key">
        <div
          class="group position-relative mx-1 h-7 flex cursor-pointer items-center rounded-lg bg-white pl-3 shadow transition dark:bg-#27272c hover:text-#1e90ffFF hover:opacity-80"
          :class="{
            'bg-#1e90ffFF! text-#fff!': appStore.activeKey === element.path,
          }"
          @click="tabsEvent(element)"
          @contextmenu="handleContextMenu($event, element)"
        >
          <div class="w-full">
            {{ element.meta?.title || element.name as string || element.path as string }}
          </div>
          <div
            class="i-line-md:close-small"
            :class="[
              appStore.tabsList.length > 1 ? 'group-hover:visible' : 'invisible',
              appStore.activeKey === element.path ? 'visible' : 'invisible',
            ]"
            @click.stop="tabsDeleteEvent(element)"
          />
        </div>
      </template>
    </VueDraggable>
    <n-icon
      v-show="showScrollButton"
      class="i-material-symbols:chevron-right cursor-pointer text-3xl"
      @click="handleScrollEvent('right')"
    />
  </n-layout-header>
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    :x="x"
    :y="y"
    :options="options"
    :show="showDropdown"
    :on-clickoutside="onClickoutside"
    @select="handleSelect"
  />
</template>

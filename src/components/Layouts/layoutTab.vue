<script lang="ts" setup>
import { VueDraggable } from 'vue-draggable-plus'
import { useAppStore } from '@/store/app'
import { renderIcon } from '@/utils/tools'

const appStore = useAppStore()
const route = useRoute()
const draggableRef = ref<any>(null)
const showScrollButton = ref(true)
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

useEventListener(window, 'resize', () => {
  showScrollButton.value
      = draggableRef.value?.$el.scrollWidth > draggableRef.value?.$el.offsetWidth
})
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
    <VueDraggable ref="draggableRef" v-model="appStore.tabsList" :animation="300" :class="`h-full flex flex-1 items-center gap-2 overflow-hidden ${showScrollButton ? '' : 'mx-2'}`">
      <template v-for="element in appStore.tabsList" :key="element.key">
        <div
          class="group position-relative h-7 flex flex-shrink-0 cursor-pointer items-center rounded-lg bg-white px-2 shadow dark:bg-#27272c hover:text-#1e90ffFF hover:opacity-80"
          :class="[
            appStore.activeKey === element.path ? 'bg-#1e90ffFF! text-#fff!' : '',
          ]"
          @click="tabsEvent(element)"
          @contextmenu="handleContextMenu($event, element)"
        >
          <div class="h-8 text-12px leading-8">
            {{ element.meta?.title || element.name as string || element.path as string }}
          </div>
          <div
            class="i-line-md:close-small position-relative left-1 w-0 transition-all"
            :class="[
              appStore.tabsList.length > 1 ? 'group-hover:w-4' : '',
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

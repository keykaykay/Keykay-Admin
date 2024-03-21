<script lang="ts" setup>
import Draggable from 'vuedraggable'
import { useAppStore } from '@/store/app'
import { renderIcon } from '@/utils/tools'

const appStore = useAppStore()
const router = useRouter()
const route = useRoute()
const draggableRef = ref<any>()
const showScrollButton = ref(false)
const tabListItemWidth = 110
const list = computed(() => appStore.tabsList)
const x = ref(0)
const y = ref(0)
const showDropdown = ref(false)
let ctxTabItem: AppRouteRecordRaw = {}
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

function tabsEvent(element: AppRouteRecordRaw) {
  router.push(element.fullPath || '')
}

function handleContextMenu(e: MouseEvent, el: AppRouteRecordRaw) {
  e.preventDefault()
  showDropdown.value = true
  nextTick().then(() => {
    showDropdown.value = true
    x.value = e.clientX
    y.value = e.clientY
  })
  ctxTabItem = el
}

function tabsDeleteEvent(element: AppRouteRecordRaw) {
  if (list.value.length === 1)
    return
  const idx = list.value.findIndex(item => item.fullPath === element.fullPath)
  appStore.deleteTab(idx)
  if (appStore.activeKey === element.fullPath)
    router.push(list.value[idx - 1 < 0 ? 0 : idx - 1].fullPath || '')
}

function onClickoutside() {
  showDropdown.value = false
}

function handleSelect(key: string | number) {
  showDropdown.value = false
  switch (key) {
    case '1':
      router.push(`/redirect${ctxTabItem.fullPath}`)
      break
    case '2':
      tabsDeleteEvent(ctxTabItem)
      break
    case '3':
      appStore.tabsList = [ctxTabItem]
      router.push(`/redirect${ctxTabItem.fullPath}`)
      break
    case '4':
      appStore.tabsList = []
      router.push('/redirect/')
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
    // deep: true,
    // immediate: true,
  },
)
</script>

<template>
  <n-layout-header
    class="mb-2px h-40px w-full flex items-center border-b-1 border-gray-200 dark:border-gray-700"
  >
    <n-icon
      v-show="showScrollButton"
      class="i-material-symbols:chevron-left cursor-pointer text-3xl"
      @click="handleScrollEvent('left')"
    />
    <Draggable
      ref="draggableRef"
      :list="list"
      animation="300"
      item-key="fullPath"
      class="h-full flex flex-1 items-center overflow-hidden"
    >
      <template #item="{ element }">
        <div
          class="position-relative mx-4px h-32px w-102px flex flex-shrink-0 cursor-pointer items-center justify-center rounded-lg bg-gray-2 dark:bg-#27272c hover:text-#1e90ffFF hover:opacity-80"
          :class="{
            'bg-#1e90ffFF!': appStore.activeKey === element.fullPath,
            'text-#fff!': appStore.activeKey === element.fullPath,
          }"
          @mouseover="element.hover = true"
          @mouseleave="element.hover = false"
          @click="tabsEvent(element)"
          @contextmenu="handleContextMenu($event, element)"
        >
          <div>{{ element.meta?.title }}</div>
          <transition name="fade" appear>
            <div
              v-show="element.hover"
              class="position-absolute right-1 top-1px h-full"
              :class="{
                'i-iconoir:cancel': element.showClose,
              }"
              @click.stop="tabsDeleteEvent(element)"
            />
          </transition>
        </div>
      </template>
    </Draggable>
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

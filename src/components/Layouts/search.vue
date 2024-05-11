<script lang="ts" setup>
import { useMobile } from '@/hooks/useDevice'
import { useAppStore } from '@/store/app'
import { getFlatMenus } from '@/utils/tools'

const visible = defineModel<boolean>('show', { required: true })

const { isMobile } = useMobile()
const appStore = useAppStore()
const router = useRouter()
const rawRoutes: AppRouteRecordRaw[] = getFlatMenus()

const keyword = ref('')
const resultOptions = ref<AppRouteRecordRaw[]>([])
const activePath = ref<string>(appStore.activeKey)

function handleClose() {
  visible.value = false
  setTimeout(() => {
    resultOptions.value = []
    keyword.value = ''
  }, 200)
}

function handleUp() {
  const { length } = resultOptions.value
  if (length === 0)
    return

  const index = resultOptions.value.findIndex(item => item.path === activePath.value)
  if (index === -1)
    return

  const activeIndex = index === 0 ? length - 1 : index - 1

  activePath.value = resultOptions.value[activeIndex].path!
}

function handleDown() {
  const { length } = resultOptions.value
  if (length === 0)
    return

  const index = resultOptions.value.findIndex(item => item.path === activePath.value)
  let activeIndex = 0
  if (index === -1)
    activeIndex = 0
  else
    activeIndex = index === length - 1 ? 0 : index + 1

  activePath.value = resultOptions.value[activeIndex].path!
}

function handleEnter(e: Event | undefined) {
  if (resultOptions.value?.length === 0 || activePath.value === '')
    return

  e?.preventDefault()
  handleClose()
  router.push(activePath.value)
}

function search() {
  activePath.value = appStore.activeKey
  resultOptions.value = rawRoutes.filter((menu) => {
    const trimKeyword = keyword.value.toLocaleLowerCase().trim()
    const title = menu.meta?.title || menu.name as string || menu.path as string
    const name = menu.name as string
    return trimKeyword && (title.includes(trimKeyword) || name.includes(trimKeyword))
  })
}

const handleSearch = useDebounceFn(search, 300)

function handleMouseEnter(routePath: string) {
  activePath.value = routePath
}

function registerShortcut() {
  onKeyStroke('Escape', handleClose)
  onKeyStroke('Enter', handleEnter)
  onKeyStroke('ArrowUp', handleUp)
  onKeyStroke('ArrowDown', handleDown)
}

registerShortcut()
</script>

<template>
  <NModal
    v-model:show="visible"
    :segmented="{ footer: 'soft' }"
    :closable="false"
    preset="card"
    auto-focus
    footer-style="padding: 0; margin: 0"
    class="fixed left-0 right-0"
    :class="[isMobile ? 'size-full top-0px rounded-0' : 'w-660px top-88px']"
    @after-leave="handleClose"
  >
    <NInputGroup>
      <NInput v-model:value="keyword" clearable placeholder="请输入关键词搜索" @input="handleSearch">
        <template #prefix>
          <div class="i-ic:baseline-search text-15px text-#c2c2c2" />
        </template>
      </NInput>
      <NButton v-if="isMobile" type="primary" ghost @click="handleClose">
        取消
      </NButton>
    </NInputGroup>

    <div class="mt-20px">
      <NEmpty v-if="resultOptions.length === 0" description="无数据" />
      <NScrollbar>
        <div class="pb-12px">
          <template v-for="item in resultOptions" :key="item.path">
            <div
              class="mt-8px h-56px flex cursor-pointer items-center justify-between rounded-4px bg-#e5e7eb px-14px dark:bg-dark"
              :style="{
                background: item.path === activePath ? appStore.themeSettings.themeColor : '',
                color: item.path === activePath ? '#fff' : '',
              }"
              @click="handleEnter"
              @mouseenter="() => handleMouseEnter(item.path || '')"
            >
              <div v-if="item.meta?.icon">
                <div :class="`${item.meta?.icon} mr-3px p-2px text-20px`" />
              </div>
              <span class="ml-5px flex-1">
                {{ item.meta?.title || item.name as string || item.path as string }}
              </span>
              <div class="i-ant-design-enter-outlined mr-3px p-2px text-20px" />
            </div>
          </template>
        </div>
      </NScrollbar>
    </div>
    <template #footer>
      <div class="h-44px w-full flex items-center gap-14px px-24px">
        <span class="flex items-center">
          <div class="mr-6px fcc p-2px text-20px shadow-md shadow-slate-500">
            <div class="i-mdi-keyboard-return" />
          </div>
          <span>确认</span>
        </span>
        <span class="flex items-center">
          <div class="mr-6px fcc p-2px text-20px shadow-md shadow-slate-500">
            <div class="i-mdi-arrow-up-thin" />
          </div>
          <div class="mr-6px fcc p-2px text-20px shadow-md shadow-slate-500">
            <div class="i-mdi-arrow-down-thin" />
          </div>
          <span>切换</span>
        </span>
        <span class="flex items-center">
          <div class="mr-6px fcc p-2px text-20px shadow-md shadow-slate-500">
            <div class="i-mdi-keyboard-esc" />
          </div>
          <span>关闭</span>
        </span>
      </div>
    </template>
  </NModal>
</template>

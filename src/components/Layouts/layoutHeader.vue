<script lang="ts" setup>
import TopMenu from './topMenu.vue'
import SysSetting from './sysSetting.vue'
import MobileMenu from './mobileMenu.vue'

import { useMobile } from '@/hooks/useDevice'
import { useAppStore } from '@/store/app'
import { VITE_APP_TITLE } from '@/utils/constants'
import { localCacheStorage } from '@/utils/storage'
import { routes } from '@/router'

const props = defineProps<{
  wrapRef: HTMLElement | undefined
}>()
const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const isDark = useDark()
const { isMobile } = useMobile()
const { isFullscreen, toggle } = useFullscreen(props.wrapRef)
const mobileMenu = ref(false)
const settingDrawer = ref(false)
const user = computed(() => localCacheStorage.get<ILoginUserResult>('user'))

function handleChangeCollapse() {
  if (isMobile.value)
    mobileMenu.value = true
  else
    appStore.collapsed = !appStore.collapsed
}

watch([isMobile], () => {
  mobileMenu.value = false
})

watch(() => route.path, () => {
  console.log(routes)
  console.log(router.getRoutes())
  const originPaths = route.path.split('/')
  const result: AppRouteRecordRaw[] = []
  function run() {
    if (originPaths.length > 1) {
      console.log(originPaths.join('/'))
      const item = routes.find(item => item.path === originPaths.join('/'))
      result.push(item as AppRouteRecordRaw)
      originPaths.pop()
      run()
    }
  }
  run()
  console.log(result)
}, {
  immediate: true,
})
</script>

<template>
  <n-layout-header
    class="relative h-12 w-full flex items-center justify-between shadow dark:shadow-slate-700"
  >
    <div
      v-if="appStore.themeSettings.menuMode === 'top' && !isMobile"
      class="ml-2 min-w-130px flex cursor-pointer items-center"
      @click="router.push('/')"
    >
      <n-icon size="40">
        <img class="h-full w-full scale-150 object-cover" src="@/assets/images/logo.svg" alt="logo">
      </n-icon>
      <transition
        name="fade"
        enter-active-class="animate__animated animate__flipInX"
        appear
      >
        <div :class="`ml-2 text-xl ${(isDark) ? 'text-white' : 'text-black'}`">
          {{ VITE_APP_TITLE }}
        </div>
      </transition>
    </div>
    <TopMenu v-if="appStore.themeSettings.menuMode === 'top' && !isMobile" class="flex-1" />
    <div class="ml-2 fcc">
      <div
        v-if="appStore.themeSettings.menuMode === 'left' || isMobile"
        class="cursor-pointer text-xl"
        :class="[
          isMobile
            ? 'i-line-md:menu-fold-left'
            : appStore.collapsed
              ? 'i-line-md:menu-fold-right'
              : 'i-line-md:menu-fold-left',
        ]"
        @click="handleChangeCollapse"
      />
      <n-breadcrumb class="ml-4">
        <n-breadcrumb-item>
          北京总行
        </n-breadcrumb-item>
        <n-breadcrumb-item>
          天津分行
        </n-breadcrumb-item>
        <n-breadcrumb-item>
          平山道支行
        </n-breadcrumb-item>
      </n-breadcrumb>
    </div>
    <div class="mr-2 min-w-130px flex items-center justify-end gap-3">
      <div>
        <n-tooltip trigger="hover">
          <template #trigger>
            <div
              class="i-mdi:settings-outline cursor-pointer text-xl"
              @click="settingDrawer = true"
            />
          </template>
          <span>设置</span>
        </n-tooltip>
      </div>
      <div>
        <n-tooltip trigger="hover">
          <template #trigger>
            <div
              class="cursor-pointer text-2xl"
              :class="[
                isFullscreen
                  ? 'i-mdi:fullscreen-exit'
                  : 'i-mdi:fullscreen',
              ]"
              @click="toggle()"
            />
          </template>
          <span>{{ isFullscreen ? '退出全屏' : '进入全屏' }}</span>
        </n-tooltip>
      </div>
      <div>
        <n-popover trigger="hover">
          <template #trigger>
            <div class="group flex cursor-pointer items-center">
              <n-avatar round size="small" src="https://picsum.photos/200" />
              <span class="ml-1">{{ user?.username }}</span>
              <div
                class="i-material-symbols-light:keyboard-arrow-down text-xl transition-all duration-300 group-hover:rotate-180"
              />
            </div>
          </template>
          <n-grid :cols="1">
            <n-gi
              class="flex cursor-pointer items-center p-2 hover:c-[var(--k-primary-color)]"
              @click="() => router.push('/user/info')"
            >
              <div class="i-material-symbols:lock mr-1" />
              <div>修改密码</div>
            </n-gi>
            <n-gi
              class="flex cursor-pointer items-center p-2 hover:c-[var(--k-primary-color)]"
              @click="appStore.logout"
            >
              <div class="i-ri:logout-box-r-fill mr-1" />
              <div>退出登录</div>
            </n-gi>
          </n-grid>
        </n-popover>
      </div>
    </div>
  </n-layout-header>
  <MobileMenu
    :mobile-drawer="mobileMenu"
    :close-drawer-event="() => (mobileMenu = false)"
  />
  <SysSetting
    :setting-drawer="settingDrawer"
    :close-drawer-event="() => (settingDrawer = false)"
  />
</template>

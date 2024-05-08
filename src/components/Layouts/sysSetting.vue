<script lang="ts" setup>
import _ from 'lodash-es'
import { useAppStore } from '@/store/app'

const props = defineProps<{
  settingDrawer: boolean
  closeDrawerEvent: () => void
}>()

const appStore = useAppStore()

function handleChangeModel(mode: 'left' | 'top') {
  appStore.themeSettings.menuMode = mode
  props.closeDrawerEvent()
}

function handleUpdateThemeColor(val: string) {
  appStore.updateThemeSettings(val)
}

const debounceUpdateThemeColor = _.debounce(handleUpdateThemeColor)
</script>

<template>
  <n-drawer
    :show="settingDrawer"
    :on-update-show="closeDrawerEvent"
    :width="280"
    placement="right"
  >
    <n-drawer-content title="主题配置" :native-scrollbar="false">
      <n-divider title-placement="center">
        主题模式
      </n-divider>
      <ToggleTheme />
      <n-divider title-placement="center">
        导航栏模式
      </n-divider>
      <div class="h-90px w-full flex items-center justify-around">
        <n-tooltip trigger="hover" placement="bottom">
          <template #trigger>
            <div
              :class="`box-content aspect-ratio-5/4 w-16 fcc cursor-pointer rounded-lg p-1 border-transparent border-solid ${appStore.themeSettings.menuMode === 'left' ? 'border-[var(--k-primary-color)]!' : ''} hover:border-[var(--k-primary-color)]`"
            >
              <div
                class="relative whf bg-gray-200"
                @click="handleChangeModel('left')"
              >
                <div class="absolute left-0 top-0 h-full w-33% bg-[var(--k-primary-color)]" />
                <div class="absolute left-40% top-0 h-25% w-60% bg-[var(--k-secondary-color)]" />
                <div class="absolute left-40% top-30% h-70% w-60% bg-[var(--k-tertiary-color)]" />
              </div>
            </div>
          </template>
          <span>左侧菜单模式</span>
        </n-tooltip>
        <n-tooltip trigger="hover" placement="bottom">
          <template #trigger>
            <div
              :class="`box-content aspect-ratio-5/4 w-16 fcc cursor-pointer rounded-lg p-1 border-transparent border-solid ${appStore.themeSettings.menuMode === 'top' ? 'border-[var(--k-primary-color)]!' : ''} hover:border-[var(--k-primary-color)]`"
            >
              <div
                class="relative whf bg-gray-200"
                @click="handleChangeModel('top')"
              >
                <div class="absolute left-0 top-0 h-25% w-full bg-[var(--k-primary-color)]" />
                <div class="absolute left-0 top-30% h-70% w-full bg-[var(--k-tertiary-color)]" />
              </div>
            </div>
          </template>
          <span>顶部菜单模式</span>
        </n-tooltip>
      </div>
      <n-divider title-placement="center">
        主题颜色
      </n-divider>
      <div class="mt-4 flex items-center justify-between">
        <div>深色侧边栏</div>
        <n-switch v-model:value="appStore.themeSettings.inverted" />
      </div>
      <div class="mt-4 flex items-center justify-between">
        <div>灰度模式</div>
        <n-switch v-model:value="appStore.themeSettings.grayMode" />
      </div>
      <div class="mt-4 flex items-center justify-between">
        <div>主色</div>
        <n-color-picker :value="appStore.themeSettings.themeColor" :show-alpha="false" class="w-24" :modes="['hex']" @update:value="(val) => debounceUpdateThemeColor(val)" />
      </div>
      <n-divider title-placement="center">
        页面功能
      </n-divider>
      <div class="mt-4 flex items-center justify-between">
        <div>切换动画</div>
        <n-select
          v-model:value="appStore.themeSettings.animateType"
          class="w-30"
          :options="appStore.themeSettings.animateOptions"
        />
      </div>
      <div class="mt-4 flex items-center justify-between">
        <div>显示面包屑</div>
        <n-switch v-model:value="appStore.themeSettings.showBreadcrumb" />
      </div>
      <div class="mt-4 flex items-center justify-between">
        <div>显示标签栏</div>
        <n-switch v-model:value="appStore.themeSettings.showTabBar" />
      </div>
      <div class="mt-4 flex items-center justify-between">
        <div>显示底部</div>
        <n-switch v-model:value="appStore.themeSettings.showFooter" />
      </div>
      <template #footer>
        <n-button type="primary" @click="appStore.resetTheme">
          重置
        </n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<style scoped>
.setting-nav-item-leftmenu::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 33%;
  height: 100%;
  background-color: var(--k-primary-color);
  border-radius: 4px;
  z-index: 1;
}
.setting-nav-item-leftmenu::after {
  content: '';
  position: absolute;
  top: 0;
  left: 40%;
  width: 60%;
  height: 25%;
  background-color: var(--k-secondary-color);
  border-radius: 4px;
}

.setting-nav-item-topmenu::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 25%;
  background-color: var(--k-tertiary-color);
}
</style>

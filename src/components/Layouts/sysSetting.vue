<script lang="ts" setup>
import { useAppStore } from '@/store/app'

const props = defineProps<{
  settingDrawer: boolean
  closeDrawerEvent: () => void
}>()

const appStore = useAppStore()

function handleChangeModel(model: 'left' | 'top') {
  appStore.model = model
  props.closeDrawerEvent()
}
</script>

<template>
  <n-drawer
    :show="settingDrawer"
    :on-update-show="closeDrawerEvent"
    :width="280"
    placement="right"
  >
    <n-drawer-content title="系统设置">
      <n-divider title-placement="center">
        主题
      </n-divider>
      <ToggleTheme />
      <n-divider title-placement="center">
        导航栏模式
      </n-divider>
      <div class="h-90px w-full flex items-center justify-around">
        <n-tooltip trigger="hover" placement="bottom">
          <template #trigger>
            <div
              class="setting-nav-item-leftmenu relative h-48px w-56px cursor-pointer bg-gray-200"
              :style="{
                border: appStore.model === 'left' ? '2px solid #70a1ffFF' : '',
              }"
              @click="handleChangeModel('left')"
            />
          </template>
          <span>左侧菜单模式</span>
        </n-tooltip>
        <n-tooltip trigger="hover" placement="bottom">
          <template #trigger>
            <div
              class="setting-nav-item-topmenu relative h-48px w-56px cursor-pointer bg-gray-200"
              :style="{
                border: appStore.model === 'top' ? '2px solid #70a1ffFF' : '',
              }"
              @click="handleChangeModel('top')"
            />
          </template>
          <span>顶部菜单模式</span>
        </n-tooltip>
      </div>
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
  background-color: #273352;
  border-radius: 4px 0px 0px 4px;
  z-index: 1;
}
.setting-nav-item-leftmenu::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 25%;
  background-color: #fff;
}

.setting-nav-item-topmenu::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 25%;
  background-color: #273352;
}
</style>

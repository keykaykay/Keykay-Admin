<script lang="ts" setup>
import type { IFormData, IModalData, TCheckbox, TDataColumn } from '../types'

interface IHeader {
  hiddenHeader?: boolean
  searchFormItemOptions: IModalData[]
  searchFormModelData: IFormData
  chooseColumnsRaw: TCheckbox[]
  tableFullscreen: boolean
  tableToggle: () => void
  searchEvent: (query: IFormData) => void
  createEvent: () => void
  refreshEvent?: () => void
}

const props = defineProps<IHeader>()
const formData = ref<IFormData>(props.searchFormModelData)
const collapsed = ref(true)

function handleSearchResetEvent() {
  formData.value = props.searchFormItemOptions.reduce((pre, item) => {
    pre[item.path] = item.value
    return pre
  }, {} as IFormData)
}

function handleSearchQueryEvent() {
  if (!props.searchEvent) {
    console.warn('请传递searchEvent参数')
    return
  }
  props.searchEvent(formData.value)
}

function handleFixed(fixed: 'left' | 'right' | undefined, el: TDataColumn<any>) {
  el.fixed = fixed
}
</script>

<template>
  <div v-if="!hiddenHeader">
    <div>
      <n-form
        class="mb-2"
        label-placement="left"
        :label-width="100"
        :model="formData"
      >
        <div
          class="grid grid-cols-1 items-center gap-3 md:grid-cols-2 sm:grid-cols-2"
        >
          <n-form-item
            v-for="item in searchFormItemOptions"
            :key="item.label"
            class="h-10"
            :label="item.label"
            :path="item.path"
          >
            <component
              :is="item.comp"
              v-if="item.comp"
              v-model:value="formData[item.path]"
              class="w-full"
              clearable
            />
            <n-input
              v-else
              v-model:value="formData[item.path]"
              :placeholder="`请输入${item.label}`"
              clearable
            />
          </n-form-item>
        </div>
        <div class="h-10 w-full flex justify-end">
          <div class="grid grid-cols-3 items-center gap-3">
            <n-button strong secondary type="tertiary" @click="handleSearchResetEvent">
              重置
            </n-button>
            <n-button type="primary" @click="handleSearchQueryEvent">
              查询
            </n-button>
            <n-button dashed @click="collapsed = !collapsed">
              展开
              <template #icon>
                <div :class="[collapsed ? 'i-ic:baseline-keyboard-arrow-down' : 'i-ic:baseline-keyboard-arrow-up']" />
              </template>
            </n-button>
          </div>
        </div>
      </n-form>
      <div class="h-2 bg-gray-100" />
    </div>
    <div class="mt-2 flex justify-between">
      <div>
        <n-button type="primary" @click="createEvent">
          新建
          <template #icon>
            <div class="i-material-symbols:add" />
          </template>
        </n-button>
      </div>
      <div class="grid grid-cols-4 items-center gap-3 text-22px">
        <n-tooltip trigger="hover" placement="bottom">
          <template #trigger>
            <div
              class="i-mingcute:refresh-1-line cursor-pointer"
              @click="refreshEvent"
            />
          </template>
          <span>刷新</span>
        </n-tooltip>
        <n-tooltip trigger="hover" placement="bottom">
          <template #trigger>
            <div class="i-bx:export cursor-pointer" />
          </template>
          <span>导出</span>
        </n-tooltip>
        <n-popover trigger="click">
          <template #trigger>
            <n-tooltip trigger="hover" placement="bottom">
              <template #trigger>
                <div class="i-ic:sharp-settings cursor-pointer" />
              </template>
              <span>设置</span>
            </n-tooltip>
          </template>
          <n-scrollbar class="max-h-300px w-200px">
            <Draggable
              :list="chooseColumnsRaw"
              animation="300"
              item-key="key"
            >
              <template #item="{ element }">
                <div
                  class="mb-2 h-6 w-full flex items-center justify-between text-xl hover:bg-gray-100"
                >
                  <n-tooltip trigger="hover" placement="left">
                    <template #trigger>
                      <div class="i-ri:drag-move-2-fill cursor-move" />
                    </template>
                    <span>拖动调整顺序</span>
                  </n-tooltip>
                  <n-checkbox
                    v-model:checked="element.checked"
                    class="w-30"
                    :value="element.value"
                    :label="element.label"
                  />
                  <div class="w-12 flex justify-between">
                    <n-tooltip trigger="hover" placement="bottom">
                      <template #trigger>
                        <div
                          class="i-system-uicons:push-left cursor-pointer"
                          :class="{
                            'color-#70a1ff': element.fixed === 'left',
                          }"
                          @click="
                            handleFixed(
                              element.fixed === 'left' ? undefined : 'left',
                              element,
                            )
                          "
                        />
                      </template>
                      <span>固定左侧</span>
                    </n-tooltip>
                    <n-tooltip trigger="hover" placement="bottom">
                      <template #trigger>
                        <div
                          class="i-system-uicons:push-right cursor-pointer"
                          :class="{
                            'color-#70a1ff': element.fixed === 'right',
                          }"
                          @click="
                            handleFixed(
                              element.fixed === 'right'
                                ? undefined
                                : 'right',
                              element,
                            )
                          "
                        />
                      </template>
                      <span>固定右侧</span>
                    </n-tooltip>
                  </div>
                </div>
              </template>
            </Draggable>
          </n-scrollbar>
        </n-popover>
        <n-tooltip trigger="hover" placement="bottom">
          <template #trigger>
            <div
              class="cursor-pointer"
              :class="[
                tableFullscreen
                  ? 'i-ic:baseline-fullscreen-exit'
                  : 'i-ic:baseline-fullscreen',
              ]"
              @click="tableToggle"
            />
          </template>
          <span>{{ tableFullscreen ? '退出全屏' : '进入全屏' }}</span>
        </n-tooltip>
      </div>
    </div>
  </div>
</template>

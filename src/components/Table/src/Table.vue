<script lang="tsx" setup>
import Draggable from 'vuedraggable'
import type {
  DataTableRowKey,
  DataTableSortState,
  DropdownOption,
  FormInst,
  FormRules,
} from 'naive-ui'
import { NDataTable, NForm, NInput, NSelect } from 'naive-ui'
import Excel from 'exceljs'
import imageToBase64 from 'image-to-base64/browser'
import type { IFormData, IModalData, ITableProps, TCheckbox, TDataColumn, TInternalRowData } from '../types'
import { useMobile } from '@/hooks/useDevice'
import { renderIcon } from '@/utils/tools'
import Logo from '@/assets/images/logo.svg'
import { createAsyncComponent } from '@/utils/createAsyncComponent'

// TODO: 固定左侧或者右侧的时候需要改变columns中的顺序，给column添加排序参数
const props = withDefaults(defineProps<ITableProps<any>>(), {
  hiddenHeader: true,
  hiddenContextmenu: true,
})

const tableRef = ref<any>()

const isAdd = ref(true)
const modal = ref(false)
const AsyncNTable = createAsyncComponent(async () => {
  return <NDataTable data={[]} columns={[]} />
})

// 排序
function handleSorterChange(options: DataTableSortState) {
  if (!props.sortEvent) {
    console.warn('请传递sortEvent参数')
    return
  }
  props.sortEvent?.(options)
}

const rawColumns = ref<TDataColumn<any>[]>(props?.addSelection
  ? [{
      title: '选择',
      key: 'selection',
      type: 'selection',
      fixed: 'left',
    }, ...props.columns]
  : props.columns)
// 数据
const chooseColumnsRaw = ref<TCheckbox[]>(
  rawColumns.value.map(item => ({
    label: item.title,
    value: item.key,
    checked: !item.unChecked,
    fixed: item.fixed,
  }) as TCheckbox) || [],
)
const columns = computed((): TDataColumn<any>[] => {
  return chooseColumnsRaw.value
    .filter(item => item.checked)
    .map((item) => {
      const target = (rawColumns.value.find(
        columnItem => columnItem.key === item.value,
      ) || {}) as TDataColumn<any>
      return {
        ...target,
        fixed: item.fixed,
      }
    })
})
watch([chooseColumnsRaw], () => {
  if (props?.settingChangeEvent) {
    props.settingChangeEvent(chooseColumnsRaw.value.filter(item => item.value !== 'selection').map((item) => {
      const target = (rawColumns.value.find(
        columnItem => columnItem.key === item.value,
      ) || {}) as TDataColumn<any>
      return {
        ...target,
        fixed: item.fixed,
        checked: item.checked,
      }
    }))
  }
}, {
  deep: true,
})
// header事件
const cardRef = ref<HTMLElement>()
const { isFullscreen: tableFullscreen, toggle: tableToggle }
  = useFullscreen(cardRef)

function handleAddEvent() {
  if (props.headerAddEvent)
    return props.headerAddEvent()

  isAdd.value = true
  modal.value = true
}

const checkedRowKeys = ref<DataTableRowKey[]>([])
async function handleRowCheck(rowKeys: DataTableRowKey[]) {
  checkedRowKeys.value = rowKeys
  const targetDatas: any[] = []
  rowKeys.forEach((key) => {
    const target = props.data.find(item => item.key === key)
    if (target)
      targetDatas.push(target)
  })
  const workbook = new Excel.Workbook()
  const sheet = workbook.addWorksheet('test111')
  sheet.columns = [
    { header: '名称', key: 'name' },
    { header: '封图', key: 'image' },
    { header: '简介', key: 'intro' },
    { header: '描述', key: 'desc' },
  ]

  sheet.addRows(targetDatas)
  const imageId = workbook.addImage({
    base64: await imageToBase64(Logo),
    extension: 'png',
  })
  sheet.addImage(imageId, {
    tl: { col: 1, row: 1 },
    ext: { width: 50, height: 50 },
  })
  sheet.getRows(0, 1)?.forEach((item) => {
    item.height = 100
  })
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/octet-stream' })
    const aEl = document.createElement('a')
    const href = URL.createObjectURL(blob)
    aEl.href = href
    aEl.download = 'test11.xlsx'
    const event = new MouseEvent('click')
    aEl.dispatchEvent(event)
  })
}

// 固定column
const { isMobile } = useMobile()
const scrollX = ref(0)
function handleScrollX() {
  const scrollWidth = tableRef.value.$el.scrollWidth - 2
  const columnWidth = columns.value.reduce((pre, val) => {
    return pre + (val.width ? Number(val.width) : 150)
  }, 0)
  if (columnWidth >= scrollWidth)
    scrollX.value = columnWidth
  else scrollX.value = scrollWidth
}

watch([isMobile, tableRef], () => {
  if (tableRef.value?.$el)
    handleScrollX()
})

function handleFixed(fixed: 'left' | 'right' | undefined, el: TDataColumn<any>) {
  el.fixed = fixed
}

// table row 右键事件
const showDropdown = ref(false)
const xRef = ref(0)
const yRef = ref(0)
const editRawData = ref<{
  data: unknown
  index: number
}>()
const options: DropdownOption[] = [
  props.hiddenContextmenuEdit
    ? null
    : {
        label: '编辑',
        key: 'edit',
        icon: renderIcon('i-material-symbols:edit-square-outline'),
      },
  props.hiddenContextmenuDelete
    ? null
    : {
        label: () => h('span', { style: { color: 'red' } }, '删除'),
        key: 'delete',
        icon: renderIcon('i-ep:delete color-red'),
      },
].filter(Boolean) as DropdownOption[]
function onClickoutside() {
  showDropdown.value = false
}
function handleSelect(key: string) {
  showDropdown.value = false
  switch (key) {
    case 'edit':
      modal.value = true
      !(props.rowCellEditEvent) && console.warn('请传递rowCellEditEvent参数')
      props.rowCellEditEvent?.(editRawData.value || {})
      nextTick(() => {
        modal.value = true
      })
      break
    case 'delete':
      !(props.rowCellDeleteEvent) && console.warn('请传递rowCellDeleteEvent参数')
      props.rowCellDeleteEvent?.(editRawData.value?.index || 0)
      break
    default:
      break
  }
}
function handleRowProps(rowData: TInternalRowData, rowIdx: number) {
  return {
    onContextmenu: async (e: MouseEvent) => {
      if (props?.hiddenContextmenu)
        return

      e.preventDefault()
      showDropdown.value = false
      await nextTick()
      showDropdown.value = true
      xRef.value = e.clientX
      yRef.value = e.clientY
      editRawData.value = {
        data: rowData,
        index: rowIdx,
      }
      isAdd.value = false
    },
    onclick: () => {
      if (!props.rowCellClickEvent) {
        console.warn('请传递rowCellClickEvent参数')
        return
      }
      props.rowCellClickEvent?.(rowData, rowIdx)
    },
  }
}

const formItemOptions = ref<IModalData[]>([])
const formModelData = ref<IFormData>({})
const rawFormOptions = props.columns?.filter((item: any) => !(item.edit === false)).filter((item: any) => item.title).map((item: any) => ({
  ...item,
  label: item.title as string,
  value: item.editValue || null,
  comp: item.editComp,
  path: item.key as string,
})) || []

const formRules = ref<FormRules>(
  props.columns?.filter((item: any) => !(item.edit === false))
    .reduce((pre: any, item: any) => {
      if (item?.rule) {
        pre[item.key] = item.rule
      }
      else {
        pre[item.key] = {
          required: true,
          message: `${item.title}是必填项`,
        }
      }
      return pre
    }, {} as any),
)
const modalLoading = ref(false)
const modalTitle = ref<string>()
const modalRef = ref<HTMLElement>()
const modalFromRef = ref<FormInst | null>(null)
const { isFullscreen: modalFullscreen, toggle: modalToggle }
  = useFullscreen(modalRef)
function handleEditOrAddEvent(e: MouseEvent) {
  e.preventDefault()
  if (!props.addEditSureEvent) {
    console.warn('请传递addEditSureEvent参数')
    return
  }
  modalFromRef.value?.validate(async (errors) => {
    if (!errors) {
      modalLoading.value = true
      const type = isAdd.value ? 'add' : 'edit'
      const idx = editRawData.value?.index || 0
      const data = {
        ...props.data[idx],
        ...formModelData.value,
      }
      const result
        = (await props.addEditSureEvent?.(
          type,
          data,
          idx,
        )) || false
      result && (modal.value = false)
      modalLoading.value = false
    }
  })
}
watch(
  [modal],
  () => {
    if (isAdd.value) {
      modalTitle.value = '添加信息'
      formItemOptions.value = rawFormOptions
    }
    else {
      modalTitle.value = '编辑信息'
      formItemOptions.value = rawFormOptions.map((item) => {
        const target = props.columns?.find(fItem => fItem.key === item.path)
        if (target && target !== undefined) {
          return {
            ...item,
            value: target.editComp
              ? (editRawData.value?.data as any)[target.key as string]
              : String((editRawData.value?.data as any)[target.key as string]),
          }
        }
        return item
      })
    }
    formModelData.value = formItemOptions.value.reduce((pre, item) => {
      pre[item.path] = item.value
      return pre
    }, {} as IFormData)
  },
  {
    immediate: true,
  },
)

const searchFormModelData = ref<IFormData>(rawFormOptions.filter(item => !item.hiddenSearch).reduce((pre, item) => {
  item.path && (pre[item.path] = item.value)
  return pre
}, {} as IFormData))
const searchCollapsed = ref(true)
const searchFormItemOptions = computed<IModalData[]>(() => {
  if (searchCollapsed.value)
    return rawFormOptions.filter(item => !item.hiddenSearch).slice(0, 2)

  else
    return rawFormOptions.filter(item => !item.hiddenSearch)
})

function handleAddSearchFormComp(formData: IFormData, item: IModalData) {
  return (
    <>
      {item?.comp === 'Select'
      && (
        <NSelect
          value={formData[item.path]}
          placeholder={`请选择${item.label}`}
          options={item.editCompOptions}
          class="w-full"
          disabled={isAdd.value ? false : item.editDisabled}
          onUpdate:value={(val: any) => {
            formData[item.path] = val
          }}
        />
      )}
      {
      item?.comp === undefined
      && (
        <NInput
          value={formData[item.path]}
          placeholder={`请输入${item.label}`}
          clearable
          disabled={isAdd.value ? false : item.editDisabled}
          onUpdate:value={(val: any) => {
            formData[item.path] = val
          }}
        />
      )
    }
    </>
  )
}

function handleSearchQueryEvent() {
  if (!props.searchEvent) {
    console.warn('请传递searchEvent参数')
    return
  }
  props.searchEvent(searchFormModelData.value)
}

function handleSearchResetEvent() {
  searchFormModelData.value = rawFormOptions.filter(item => !item.hiddenSearch).reduce((pre, item) => {
    pre[item.path] = item.value
    return pre
  }, {} as IFormData)
  handleSearchQueryEvent()
}
</script>

<template>
  <n-card
    ref="cardRef" class="h-full w-full"
  >
    <template #header>
      <slot name="header">
        <div v-if="!hiddenHeader && (!hiddenHeaderSearch || !hiddenHeaderHandle)">
          <div v-if="!hiddenHeaderSearch" class="mb-4 shadow-gray-100 shadow-md dark:shadow-gray-700">
            <NForm
              ref="modalFromRef"
              label-placement="left"
              :label-width="100"
              :model="searchFormModelData"
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
                  <component :is="handleAddSearchFormComp(searchFormModelData, item)" />
                </n-form-item>
              </div>
              <div class="h-10 w-full flex justify-end">
                <div class="flex items-center">
                  <n-button class="ml-3" strong secondary type="tertiary" @click="handleSearchResetEvent">
                    重置
                  </n-button>
                  <n-button class="ml-3" type="info" @click="handleSearchQueryEvent">
                    查询
                  </n-button>
                  <n-button v-if="searchFormItemOptions.length > 2" class="ml-3" dashed @click="searchCollapsed = !searchCollapsed">
                    展开
                    <template #icon>
                      <div :class="[searchCollapsed ? 'i-ic:baseline-keyboard-arrow-down' : 'i-ic:baseline-keyboard-arrow-up']" />
                    </template>
                  </n-button>
                </div>
              </div>
            </NForm>

            <div class="h-1 bg-gray-100 dark:bg-gray-600" />
          </div>
          <div v-if="!hiddenHeaderHandle" class="flex justify-between">
            <div>
              <n-button v-if="!hiddenHeaderLeft" type="info" @click="handleAddEvent">
                新建
                <template #icon>
                  <div class="i-material-symbols:add" />
                </template>
              </n-button>
            </div>
            <div v-if="hiddenHeaderRight" class="flex items-center text-22px">
              <n-tooltip v-if="!hiddenHeaderRight?.refresh" trigger="hover" placement="bottom">
                <template #trigger>
                  <div
                    class="i-mingcute:refresh-1-line ml-2 cursor-pointer"
                    @click="refreshEvent"
                  />
                </template>
                <span>刷新</span>
              </n-tooltip>
              <n-tooltip v-if="!hiddenHeaderRight?.export" trigger="hover" placement="bottom">
                <template #trigger>
                  <div class="i-bx:export ml-2 cursor-pointer" />
                </template>
                <span>导出</span>
              </n-tooltip>
              <n-popover v-if="!hiddenHeaderRight?.setting" trigger="click">
                <template #trigger>
                  <n-tooltip trigger="hover" placement="bottom">
                    <template #trigger>
                      <div class="i-ic:sharp-settings ml-2 cursor-pointer" />
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
                        class="mb-2 h-6 w-full flex items-center justify-between text-xl hover:bg-gray-100 dark:hover:bg-gray-600"
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
              <n-tooltip v-if="!hiddenHeaderRight?.fullscreen" trigger="hover" placement="bottom">
                <template #trigger>
                  <div
                    class="ml-2 cursor-pointer"
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
      </slot>
    </template>
    <template #default>
      <AsyncNTable
        ref="tableRef"
        v-bind="props"
        class="h-full w-full flex-1"
        max-height="100%"
        flex-height
        :single-line="false"
        :columns="columns"
        :scroll-x="scrollX"
        :row-props="rowProps || handleRowProps"
        remote
        :virtual-scroll="virtualScroll"
        :on-update:sorter="handleSorterChange"
        @update:sorter="handleSorterChange"
        @update:checked-row-keys="handleRowCheck"
      />
    </template>
    <template #footer>
      <slot name="footer" />
    </template>
  </n-card>
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    :x="xRef"
    :y="yRef"
    :options="options"
    :show="showDropdown"
    :on-clickoutside="onClickoutside"
    @select="handleSelect"
  />
  <n-modal
    :show="modal"
    transform-origin="center"
    :mask-closable="false"
    :close-on-esc="false"
  >
    <n-card
      ref="modalRef"
      v-loading="modalLoading"
      class="w-95/100"
      :title="modalTitle"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
      :segmented="{
        content: 'soft',
        footer: 'soft',
      }"
    >
      <template #header-extra>
        <n-tooltip trigger="hover" placement="bottom">
          <template #trigger>
            <div
              class="cursor-pointer text-2xl"
              :class="[
                modalFullscreen
                  ? 'i-ic:baseline-fullscreen-exit'
                  : 'i-ic:baseline-fullscreen',
              ]"
              @click="modalToggle"
            />
          </template>
          <span>{{ modalFullscreen ? '退出全屏' : '进入全屏' }}</span>
        </n-tooltip>
        <n-tooltip trigger="hover" placement="bottom">
          <template #trigger>
            <div
              class="i-ic:baseline-close cursor-pointer text-2xl"
              @click="modal = false"
            />
          </template>
          <span>关闭</span>
        </n-tooltip>
      </template>
      <slot name="modalForm">
        <NForm
          ref="modalFromRef"
          label-placement="left"
          :label-width="100"
          :model="formModelData"
          :rules="formRules"
        >
          <div
            class="grid grid-cols-1 items-center gap-3 md:grid-cols-3 sm:grid-cols-2"
          >
            <n-form-item
              v-for="item in formItemOptions"
              :key="item.label"
              :label="item.label"
              :path="item.path"
            >
              <component :is="handleAddSearchFormComp(formModelData, item)" />
            </n-form-item>
          </div>
        </NForm>
      </slot>
      <template #footer>
        <n-space justify="end">
          <n-button @click="modal = false">
            取消
          </n-button>
          <n-button type="info" @click="handleEditOrAddEvent">
            确认
          </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>
:deep(.n-data-table-sorter) {
  position: absolute !important;
  right: 10px;
}
</style>

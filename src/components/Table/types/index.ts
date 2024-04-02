import type { CheckboxProps, DataTableColumn, DataTableCreateRowProps, DataTableSortState, FormItemRule, SelectOption } from 'naive-ui'

export type TInternalRowData = Record<string, any>

type EditComp = 'Select'
type EditCompOptions = SelectOption[]

export type TDataColumn<T> = DataTableColumn<T> & {
  /**
   * 是否允许编辑
   */
  edit?: boolean
  /**
   * 编辑组件
   */
  editComp?: EditComp
  editCompOptions?: EditCompOptions
  key: string
  title?: string
  unChecked?: boolean

  rule?: FormItemRule
  hiddenSearch?: boolean
  /**
   * 编辑框是否禁用
   */
  editDisabled?: boolean
}

export interface TAddEditTable {
  type: 'add' | 'edit'
  index: number
}

export interface TCheckbox extends CheckboxProps {
  checked?: boolean
  fixed?: DataTableColumn['fixed']
}

export interface IFormData {
  [key: string]: any
}

export interface IModalData {
  label: string
  value: any
  comp?: EditComp
  path: string
  editCompOptions?: EditCompOptions
  editDisabled?: boolean
}

export interface IUniqueKey {
  /**
   * 唯一key
   */
  key: string
}

export interface ITableProps<T, V = NonNullable<unknown>, U = T & IUniqueKey> {
  /**
   * 隐藏默认header
   * 默认是 true 隐藏
   */
  hiddenHeader?: boolean
  /**
   * 隐藏header搜索组件
   * 默认 false 不隐藏
   */
  hiddenHeaderSearch?: boolean
  /**
   * 隐藏header操作组件
   * 默认 false 不隐藏
   */
  hiddenHeaderHandle?: boolean
  /**
   * 隐藏header左侧操作组件
   * 默认false不隐藏
   */
  hiddenHeaderLeft?: boolean
  /**
   * 隐藏header右侧操作组件
   */
  hiddenHeaderRight?: {
    refresh?: boolean
    export?: boolean
    setting?: boolean
    fullscreen?: boolean
  }
  /**
   * header新建事件
   */
  headerAddEvent?: () => void
  /**
   * 是否隐藏右键功能 默认隐藏
   */
  hiddenContextmenu?: boolean
  hiddenContextmenuEdit?: boolean
  hiddenContextmenuDelete?: boolean
  /**
   * 需要展示的列
   */
  columns: TDataColumn<T>[]
  /**
   * 是否需要多选
   */
  addSelection?: boolean
  /**
   * 需要展示的数据
   */
  data: U[]
  rowProps?: DataTableCreateRowProps
  /**
   * 分页选项
   */
  pagination?: V
  /**
   * 是否开启虚拟列表
   * 默认false
   */
  virtualScroll?: boolean
  /**
   * 是否展示loading
   */
  tableLoading?: boolean
  /**
   * 排序事件
   * @param options 排序选项(DataTableSortState)
   */
  sortEvent?: (options: DataTableSortState) => void
  /**
   * 单元行点击事件
   * @param rowData 当前rowCell的数据(数据type)
   * @param rowIndex 当前索引(number)
   */
  rowCellClickEvent?: (rowData: T, rowIndex: number) => void
  /**
   * 单元行编辑事件
   * @param rowData 当前数据
   */
  rowCellEditEvent?: (rowData: any) => void
  /**
   * 单元行删除事件
   * @param rowIndex 当前索引
   */
  rowCellDeleteEvent?: (rowIndex: number) => void
  /**
   * 添加或编辑确认事件
   * @param type 类型
   * @param data 最终数据(数据type)
   * @param index 编辑状态的索引
   */
  addEditSureEvent?: <U extends TAddEditTable['type']>(
    type: U,
    data: T,
    index: Extract<TAddEditTable, { type: U }>['index']
  ) => Promise<boolean>
  /**
   * 刷新事件
   */
  refreshEvent?: () => void
  /**
   * 搜索事件
   * @param query 搜索参数
   */
  searchEvent?: (query: T) => void

  /**
   * 设置配置想改动
   * @param columns 配置项
   */
  settingChangeEvent?: (columns: TDataColumn<T>[]) => void
}

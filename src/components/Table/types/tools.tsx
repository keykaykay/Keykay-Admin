import type { DataTableColumn } from 'naive-ui'
import { NImage, NPopover } from 'naive-ui'
import type { TDataColumn } from './index'
import Logo from '@/assets/favicon.png'

type TFixed = DataTableColumn['fixed']

function handleTableColumnsParams<T, U = keyof T>(columns: TDataColumn<T>[], key: U, type: 'checked'): boolean

function handleTableColumnsParams<T, U = keyof T>(columns: TDataColumn<T>[], key: U, type: 'fixed'): TFixed

function handleTableColumnsParams<T, U = keyof T>(columns: TDataColumn<T>[], key: U, type: 'checked' | 'fixed'): boolean | TFixed {
  if (type === 'checked') {
    if (columns.length === 0)
      return true

    const target = columns.find(item => item.key === key)
    if (target)
      return true

    else
      return false
  }
  if (type === 'fixed') {
    if (columns.length === 0)
      return undefined

    const target = columns.find(item => item.key === key)
    if (target)
      return target.fixed

    else
      return undefined
  }
}

type ConvertValuesToString<T> = {
  [K in keyof T]?: string;
}
type ICustomFn<T, V = keyof T> = {
  [K in keyof T]?: (key: V, rowData: T, rowIndex: number) => any;
}

function handleTableColumns<T, U = TDataColumn<T>, V = ConvertValuesToString<T>, K = keyof T>(originColumns: U[], originData: V & object, popover?: K[], image?: K[], custom?: ICustomFn<T>): U[] {
  function initRender(key: keyof T, rowData: T, rowIndex: number) {
    if (popover && popover.length > 0) {
      for (let index = 0; index < popover.length; index++) {
        const item = popover[index]
        if (key === item) {
          return (
            <>
              <NPopover class="max-h-300px w-300px" scrollable>
                {{
                  trigger: () => <div class="line-clamp-3 w-full">{rowData[key]}</div>,
                  default: () => <div>{rowData[key]}</div>,
                }}
              </NPopover>
            </>
          )
        }
      }
    }
    if (image && image.length > 0) {
      for (let index = 0; index < image.length; index++) {
        const item = image[index]
        if (key === item) {
          return (
            <>
              <NImage height={100} width={130} object-fit="scale-down" src={rowData[key] as string} fallback-src={Logo} />
            </>
          )
        }
      }
    }
    if (custom) {
      for (let index = 0; index < Object.keys(custom).length; index++) {
        const itemKey = Object.keys(custom)[index]
        if (key === itemKey)
          return custom[itemKey](key, rowData, rowIndex)
      }
    }
    return <div>{rowData[key]}</div>
  }

  function initColumns() {
    if (originColumns.length > 0) {
      return originColumns.map((item: U) => ({
        ...item,
        render(rowData: T, rowIndex: number) {
          return initRender((item as any).key, rowData, rowIndex)
        },
      }))
    }
    else {
      return Object.keys(originData).map(key => ({
        key,
        title: originData[key],
        align: 'center',
        width: 150,
        checked: true,
        fixed: undefined,
        render(rowData: T, rowIndex: number) {
          return initRender(key as any, rowData, rowIndex)
        },
      } as U))
    }
  }

  return initColumns()
}

export {
  handleTableColumnsParams,
  handleTableColumns,
}

import type { PaginationProps } from 'naive-ui'
import type { ITableProps } from './index'

declare global {
  type ITableOption<T = any, V = any> = ITableProps<T, V>
  type IPaginationProps = PaginationProps
}

export {}

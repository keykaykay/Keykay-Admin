import { type GlobalThemeOverrides } from 'naive-ui'

export const { VITE_APP_TITLE, VITE_BASE_URL, VITE_WS_URL, VITE_IMG_PREFIX }
  = import.meta.env

export const ECHARTS_COLOR: string[] = [
  '#5ab1ef',
  '#fa6e86',
  '#19d4ae',
  '#ffb980',
  '#0067a6',
  '#c4b4e4',
  '#d87a80',
  '#9cbbff',
  '#d9d0c7',
  '#87a997',
  '#d49ea2',
  '#5b4947',
  '#7ba3a8',
]

export const primaryColor = '#1e90ffFF'
export const secondaryColor = '#70a1ffFF'

export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColorHover: secondaryColor,
    primaryColor,
    primaryColorPressed: secondaryColor,
    primaryColorSuppl: primaryColor,
  },
  LoadingBar: {
    colorLoading: primaryColor,
  },
}

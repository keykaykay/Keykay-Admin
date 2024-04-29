declare namespace App {

  type TCssVarKey = '--k-primary-color' | '--k-secondary-color' | '--k-tertiary-color'
  interface ThemeSetting {
    inverted: boolean
    menuMode: 'left' | 'top'
    cssVars: {
      [key in TCssVarKey]: string
    }
    themeColor: string
    themeOverrides: import('naive-ui').GlobalThemeOverrides
  }
}

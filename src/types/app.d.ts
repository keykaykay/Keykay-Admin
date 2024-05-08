declare namespace App {

  type TCssVarKey = '--k-primary-color' | '--k-secondary-color' | '--k-tertiary-color'
  interface IAnimateType {
    'animate__fadeInRight': '滑动'
    'animate__fadeIn': '淡入'
    'animate__fadeInUp': '向上淡入'
    'animate__zoomIn': '缩放'
    'animate__bounceIn': '渐变'
    'no-animate': '无'
  }
  interface ThemeSetting {
    inverted: boolean
    menuMode: 'left' | 'top'
    cssVars: {
      [key in TCssVarKey]: string
    }
    themeColor: string
    themeOverrides: import('naive-ui').GlobalThemeOverrides
    grayMode: boolean
    showBreadcrumb: boolean
    showTabBar: boolean
    showFooter: boolean
    animateType: keyof IAnimateType
    animateOptions: {
      label: IAnimateType[keyof IAnimateType]
      value: keyof IAnimateType
    }[]
  }
}

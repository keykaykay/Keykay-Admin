function handleThemeColor(primaryColor: string): App.ThemeSetting {
  const animateObj: App.IAnimateType = {
    'animate__fadeInRight': '滑动',
    'animate__fadeIn': '淡入',
    'animate__fadeInUp': '向上淡入',
    'animate__zoomIn': '缩放',
    'animate__bounceIn': '渐变',
    'no-animate': '无',
  }
  return {
    inverted: false,
    themeColor: primaryColor,
    menuMode: 'left',
    cssVars: {
      '--k-primary-color': primaryColor,
      '--k-secondary-color': `${primaryColor}bf`,
      '--k-tertiary-color': `${primaryColor}40`,
    },
    grayMode: false,
    showBreadcrumb: true,
    showFooter: true,
    showTabBar: true,
    animateType: 'animate__fadeInRight',
    animateOptions: [
      {
        label: animateObj.animate__fadeInRight,
        value: 'animate__fadeInRight',
      },
      {
        label: animateObj.animate__fadeIn,
        value: 'animate__fadeIn',
      },
      {
        label: animateObj.animate__fadeInUp,
        value: 'animate__fadeInUp',
      },
      {
        label: animateObj.animate__zoomIn,
        value: 'animate__zoomIn',
      },
      {
        label: animateObj.animate__bounceIn,
        value: 'animate__bounceIn',
      },
      {
        label: animateObj['no-animate'],
        value: 'no-animate',
      },
    ],
    themeOverrides: {
      common: {
        primaryColorHover: primaryColor,
        primaryColor,
        primaryColorPressed: primaryColor,
        primaryColorSuppl: primaryColor,
      },
      LoadingBar: {
        colorLoading: primaryColor,
      },
    },
  }
}

export function getThemeSettings(colorHex: string, cacheTheme: App.ThemeSetting): App.ThemeSetting {
  if (colorHex === cacheTheme.themeColor)
    return cacheTheme
  else
    return handleThemeColor(colorHex)
}

export function resetThemeSetting() {
  return handleThemeColor('#1E90FF')
}

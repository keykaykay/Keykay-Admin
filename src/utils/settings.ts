export function getThemeSettings(colorHex?: string): App.ThemeSetting {
  const primaryColor = colorHex || '#1e90ff'
  return {
    inverted: false,
    themeColor: primaryColor,
    menuMode: 'left',
    cssVars: {
      '--k-primary-color': primaryColor,
      '--k-secondary-color': `${primaryColor}bf`,
      '--k-tertiary-color': `${primaryColor}40`,
    },
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

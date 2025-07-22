import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons()
  ],
  theme: {
    colors: {
      primary: '#C97C5D',
      secondary: '#F7E7D7',
      snow: '#FFFAF5',
      dark: '#1B170E',
      primary_dark: '#CFB17D',
      secondary_dark: '#423a2f',
      blue: {
        light: '#44AAE9',
        dark: '#3093d0'
      },
      alert: '#E04C10'
    },
  }
})

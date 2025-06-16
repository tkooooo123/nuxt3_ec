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
      primary_dark: '#CFB17D'
    },
  }
})

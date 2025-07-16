// stores/loading.ts
import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref<boolean>(false)

  function show() {
   isLoading.value = true
  }

  function hide() {
   isLoading.value = false
  }

  function reset() {
    isLoading.value = false
  }

  return {
    isLoading,
    show,
    hide,
    reset
  }
})

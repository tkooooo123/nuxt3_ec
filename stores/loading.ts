// stores/loading.ts
import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', () => {
  const counter = ref(0)

  const isLoading = computed(() => counter.value > 0)

  function show() {
    counter.value++
  }

  function hide() {
    // 防止變負數
    if (counter.value > 0) {
      counter.value--
    }
  }

  function reset() {
    counter.value = 0
  }

  return {
    isLoading,
    show,
    hide,
    reset
  }
})
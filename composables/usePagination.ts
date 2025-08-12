import { ref, computed } from 'vue'
import type { Ref } from 'vue'

export function usePagination<T>(source: Ref<T[]>, initialPageSize = 10) {
  const currentPage = ref(1)
  const pageSize = ref(initialPageSize)

  const pagedData = computed<T[]>(() => {
    if (!source.value.length) return []
    const start = (currentPage.value - 1) * pageSize.value
    return source.value.slice(start, start + pageSize.value)
  })

  const totalPages = computed(() =>
    Math.ceil(source.value.length / pageSize.value)
  )

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
  }

  return {
    currentPage,
    pageSize,
    pagedData,
    totalPages,
    changePage
  }
}
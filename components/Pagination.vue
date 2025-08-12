<script setup lang="ts">
interface Props {
  total: number
  pageSize?: number
  currentPage?: number
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 10,
  currentPage: 1
})

const emit = defineEmits<{
  (e: 'update:currentPage', value: number): void
}>()

const handlePageChange = (page: number) => {
  emit('update:currentPage', page)
}
</script>

<template>
  <el-pagination
    background
    layout="prev, pager, next"
    :total="props.total"
    :page-size="props.pageSize"
    :current-page="props.currentPage"
    @current-change="handlePageChange"
    class="pagination"
  />
</template>


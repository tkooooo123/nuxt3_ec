<script lang="ts" setup>
const isExpanded = ref<boolean>(true)
</script>
 
<template>
  <div
    class=" h-100vh transition-property-all transition-ease-linear transition-duration-300 transform-origin-l overflow-hidden"
    :class="isExpanded ? 'w-316px' : 'w-80px'"
    :style="
      isExpanded
        ? { boxShadow: '6px 2px 12px 0px #00000040' }
        : { boxShadow: '0px 4px 4px 0px #00000040' }
    "
  >
    <div
      class="fixed top-10 transition-property-all transition-ease-linear transition-duration-300 transform-origin-l h-20 w-8 bg-white rounded-2 border-solid border-1 border-#F6F6F6 cursor-pointer flex items-center justify-center z-10 overflow-hidden"
      @click="isExpanded = !isExpanded"
      :class="isExpanded ? 'left-[300px]' : 'left-[64px]'"
      style="box-shadow: 0px 1px 2px 0px #00000040"
    ></div>
  </div>
</template>
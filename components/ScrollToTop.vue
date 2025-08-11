<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'

export default {
  setup() {
    const toggleClass = ref('')

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    const toggleBtn = () => {
      toggleClass.value = window.scrollY > 200 ? 'show' : 'hide'
    }

    onMounted(() => {
      window.addEventListener('scroll', toggleBtn)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', toggleBtn)
    })

    return {
      toggleClass,
      scrollToTop
    }
  }
}
</script>

<template>
  <RouterLink class="to-top bg-primary p-0 " to="" @click="scrollToTop" :class="toggleClass">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="size-6 text-white"
    >
      <path
        fill-rule="evenodd"
        d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
        clip-rule="evenodd"
      />
    </svg>
  </RouterLink>
</template>

<style lang="scss">
.to-top {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  position: fixed;
  bottom: 3rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  visibility: hidden;
  z-index: 20;
}
.hide {
  visibility: hidden;
}
.show {
  visibility: visible;
}
</style>
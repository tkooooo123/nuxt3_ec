<template>
  <div
    class="loader-wrap"
    :class="isLoading || loadingStore.isLoading ? 'loader-visible' : 'loader-hidden'"
  >
    <div class="loader">
      <svg viewBox="0 0 86 80">
        <polygon points="43 8 79 72 7 72" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { globalMiddleware } from '#build/middleware'
import { useLoadingStore } from '@/stores/loading'

const props = defineProps({
  throttle: {
    type: Number,
    default: 200,
  },
  hold: {
    type: Number,
    default: 400,
  },
})

const loadingStore = useLoadingStore()

const isLoading = ref(false)

let _throttleTimer = null

function clear() {
  clearTimeout(_throttleTimer)
  _throttleTimer = null
}

function show() {
  clear()
  if (import.meta.client) {
    if (props.throttle > 0) {
      _throttleTimer = setTimeout(() => {
        isLoading.value = true
      }, props.throttle)
    } else {
      isLoading.value = true
    }
  }
}

function hide() {
  clear()
  if (import.meta.client) {
    setTimeout(() => {
      isLoading.value = false
    }, props.hold)
  }
}

globalMiddleware.unshift(show)
function unsubRouterBeforeMiddleware() {
  globalMiddleware.splice(globalMiddleware.indexOf(show, 1))
}

const nuxtApp = useNuxtApp()
const unsubPageFinish = nuxtApp.hook('page:finish', hide)
const unsubError = nuxtApp.hook('vue:error', hide)

onBeforeUnmount(() => {
  unsubRouterBeforeMiddleware()
  unsubPageFinish()
  unsubError()
})

const router = useRouter()

router.onError(() => {
  hide()
})

router.beforeResolve((to, from) => {
  if (to.fullPath === from.fullPath) {
    hide()
  }

  const onlyQueryChanged = to.path === from.path && to.fullPath !== from.fullPath
  if (onlyQueryChanged) {
    hide()
  }
})

router.afterEach((_to, _from, failure) => {
  if (failure) {
    hide()
  }
})

</script>

<style scoped>
.loader-wrap {
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  z-index: 999999;
  background-color: rgb(0 0 0 / 0.35);
  backdrop-filter: blur(4px);
  transition-property: background-color, visibility, opacity, scale;
  transition-duration: 0.2s;
}

.loader-wrap.loader-visible {
  visibility: visible;
  opacity: 1;
  scale: 1.5;
}

.loader-wrap.loader-hidden {
  visibility: hidden;
  opacity: 0;
  scale: 1;
}

.loader svg {
  display: block;
  width: 100%;
  height: 100%;
}

.loader svg polygon {
  fill: none;
  stroke: var(--path);
  stroke-width: 10px;
  stroke-linejoin: round;
  stroke-linecap: round;
  stroke-dasharray: 145 76 145 76;
  stroke-dashoffset: 0;
  animation: pathTriangle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86)
    infinite;
}
.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #FFF;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  animation: pulse 1s linear infinite;
}
.loader:after {
  content: '';
  position: absolute;
  width: 48px;
  height: 48px;
  border: 5px solid #FFF;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  animation: scaleUp 1s linear infinite;
}

@keyframes scaleUp {
  0% { transform: translate(-50%, -50%) scale(0) }
  60% , 100% { transform: translate(-50%, -50%)  scale(1)}
}
@keyframes pulse {
  0% , 60% , 100%{ transform:  scale(1) }
  80% { transform:  scale(1.2)}
}
</style>

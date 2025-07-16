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
  position: relative;
  width: 2.5em;
  height: 2.5em;
  transform: rotate(165deg);
}

.loader:before,
.loader:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: 0.5em;
  height: 0.5em;
  border-radius: 0.25em;
  transform: translate(-50%, -50%);
}

.loader:before {
  animation: before8 2s infinite;
}

.loader:after {
  animation: after6 2s infinite;
}

@keyframes before8 {
  0% {
    width: 0.5em;
    box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75),
      -1em 0.5em rgba(111, 202, 220, 0.75);
  }

  35% {
    width: 2.5em;
    box-shadow: 0 -0.5em rgba(225, 20, 98, 0.75),
      0 0.5em rgba(111, 202, 220, 0.75);
  }

  70% {
    width: 0.5em;
    box-shadow: -1em -0.5em rgba(225, 20, 98, 0.75),
      1em 0.5em rgba(111, 202, 220, 0.75);
  }

  100% {
    box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75),
      -1em 0.5em rgba(111, 202, 220, 0.75);
  }
}

@keyframes after6 {
  0% {
    height: 0.5em;
    box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75),
      -0.5em -1em rgba(233, 169, 32, 0.75);
  }

  35% {
    height: 2.5em;
    box-shadow: 0.5em 0 rgba(61, 184, 143, 0.75),
      -0.5em 0 rgba(233, 169, 32, 0.75);
  }

  70% {
    height: 0.5em;
    box-shadow: 0.5em -1em rgba(61, 184, 143, 0.75),
      -0.5em 1em rgba(233, 169, 32, 0.75);
  }

  100% {
    box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75),
      -0.5em -1em rgba(233, 169, 32, 0.75);
  }
}
</style>

<script lang="ts" setup>
import Logo from '@/assets/images/logo.svg'

const props = withDefaults(
  defineProps<{
    images: string[]
    index: number
    hidden: () => void
  }>(),
  {},
)

let initialX = 0
let initialY = 0
let offsetX = 0
let offsetY = 0
const isMouseDown = ref(false)
const translateX = ref(0)
const translateY = ref(0)

const imageRef = ref<HTMLDivElement | null>(null)
const disableScale = ref(true)
const imageScale = ref(1)
const imageRotate = ref(0)
const currentIndex = ref(props.index)
const currentImage = computed(() => {
  if (currentIndex.value < 0 || currentIndex.value >= props.images.length || props.images.length === 0)
    return ''

  return props.images[currentIndex.value]
})

function resetPayload() {
  imageScale.value = 1
  imageRotate.value = 0
  disableScale.value = true
  translateX.value = 0
  translateY.value = 0
  initialX = 0
  initialY = 0
  offsetX = 0
  offsetY = 0
}

function handleAddEvent() {
  if (disableScale.value)
    return

  if (imageScale.value < 4)
    imageScale.value += 0.2
}

function handleCutEvent() {
  if (disableScale.value)
    return

  if (imageScale.value > 0.4)
    imageScale.value -= 0.2
}

function handleLeftEvent() {
  if (currentIndex.value === 0)
    return

  resetPayload()
  currentIndex.value -= 1
}

function handleRightEvent() {
  if (currentIndex.value === props.images.length - 1)
    return

  resetPayload()
  currentIndex.value += 1
}

function handleLeftRotate() {
  if (disableScale.value)
    return

  imageRotate.value -= 90
}

function handleRightRotate() {
  if (disableScale.value)
    return

  imageRotate.value += 90
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft')
    handleLeftEvent()

  if (e.key === 'ArrowRight')
    handleRightEvent()

  if (e.key === 'Escape')
    props.hidden()
}

function handleWheel(e: WheelEvent) {
  if (e.deltaY < 0)
    handleAddEvent()

  if (e.deltaY > 0)
    handleCutEvent()
}

function handleImageLoadSuccess() {
  disableScale.value = false
}

function handleMouseDown(e: MouseEvent) {
  isMouseDown.value = true
  initialX = e.clientX - offsetX
  initialY = e.clientY - offsetY
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

function handleMouseMove(e: MouseEvent) {
  if (isMouseDown.value) {
    translateX.value = e.clientX - initialX
    translateY.value = e.clientY - initialY
  }
}

function handleMouseUp(e: MouseEvent) {
  isMouseDown.value = false
  offsetX = e.clientX - initialX
  offsetY = e.clientY - initialY
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('wheel', handleWheel)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('wheel', handleWheel)
})
</script>

<template>
  <teleport to="body">
    <div class="absolute bottom-0 left-0 right-0 top-0 z-99999 fcc bg-gray-500 bg-opacity-75">
      <n-image
        ref="imageRef"
        :key="currentIndex"
        :width="640"
        :height="420"
        :style="{
          'transform': `translateX(${translateX}px) translateY(${translateY}px) scale(${imageScale}) rotate(${imageRotate}deg)`,
          'transform-origin': 'center center',
          'transition': isMouseDown ? 'none 0s' : 'all 0.2s',
        }"
        :src="currentImage"
        preview-disabled
        object-fit="scale-down"
        :on-load="handleImageLoadSuccess"
        :fallback-src="Logo"
        @mousedown="handleMouseDown"
      />
      <div class="absolute bottom-10 h-10 w-59 fcb flex rounded-5 bg-gray-900 bg-opacity-75 px-5 text-white">
        <div class="i-ph:magnifying-glass-minus cursor-pointer text-xl" @click="handleCutEvent" />
        <div class="i-ph:magnifying-glass-plus cursor-pointer text-xl" @click="handleAddEvent" />
        <div class="i-ph:arrow-counter-clockwise-fill cursor-pointer text-xl" @click="handleLeftRotate" />
        <div class="i-ph:arrow-clockwise-fill cursor-pointer text-xl" @click="handleRightRotate" />
      </div>
      <div class="i-ph:arrow-circle-left absolute left-6 text-5xl transition-all" :class="[currentIndex === 0 ? 'text-gray cursor-not-allowed' : 'text-white cursor-pointer hover:text-#1e90ffFF']" @click="handleLeftEvent" />
      <div class="i-ph:arrow-circle-right absolute right-6 cursor-pointer text-5xl text-white transition-all" :class="[currentIndex === images.length - 1 ? 'text-gray cursor-not-allowed' : 'text-white cursor-pointer hover:text-#1e90ffFF']" @click="handleRightEvent" />
      <div class="i-mdi:close-circle-outline absolute right-4 top-4 cursor-pointer text-3xl text-white transition-all hover:text-#1e90ffFF" @click="hidden" />
      <div class="absolute bottom-2 h-6 w-59 px-5 text-center text-sm text-white">
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>
    </div>
  </teleport>
</template>

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

function handleInitialRatio() {
  if (disableScale.value)
    return

  imageScale.value = 1
}

function handleGroupHidden(e: MouseEvent) {
  if (e.target.className.includes('preview-group'))
    props.hidden()
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
    <div
      class="preview-group absolute bottom-0 left-0 right-0 top-0 z-100 fcc bg-black bg-opacity-60" @click="handleGroupHidden"
    >
      <n-image
        ref="imageRef"
        :key="currentIndex"
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
      <div class="absolute bottom-10 h-10 flex flex items-center gap-6 rounded-5 bg-gray-900 bg-opacity-75 px-2 px-5 text-white">
        <n-tooltip trigger="hover">
          <template #trigger>
            <div class="i-ph:arrow-left cursor-pointer text-xl" :class="[currentIndex === 0 ? 'text-gray cursor-not-allowed' : 'text-white cursor-pointer hover:text-#1e90ffFF']" @click="handleLeftEvent" />
          </template>
          上一张
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <div class="i-ph:arrow-right cursor-pointer text-xl" :class="[currentIndex === images.length - 1 ? 'text-gray cursor-not-allowed' : 'text-white cursor-pointer hover:text-#1e90ffFF']" @click="handleRightEvent" />
          </template>
          下一张
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <div class="i-ph:magnifying-glass-minus cursor-pointer text-xl hover:text-#1e90ffFF" @click="handleCutEvent" />
          </template>
          缩小
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <div class="i-ph:magnifying-glass-plus cursor-pointer text-xl hover:text-#1e90ffFF" @click="handleAddEvent" />
          </template>
          放大
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <div class="i-ph:arrow-counter-clockwise-fill cursor-pointer text-xl hover:text-#1e90ffFF" @click="handleLeftRotate" />
          </template>
          向左旋转
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <div class="i-ph:arrow-clockwise-fill cursor-pointer text-xl hover:text-#1e90ffFF" @click="handleRightRotate" />
          </template>
          向右旋转
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <div class="i-ph:corners-out cursor-pointer text-xl hover:text-#1e90ffFF" @click="handleInitialRatio" />
          </template>
          初始比例
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <div class="i-ph:x cursor-pointer text-xl hover:text-#1e90ffFF" @click="hidden" />
          </template>
          关闭
        </n-tooltip>
      </div>
      <div class="absolute top-6 h-6 w-59 px-5 text-center text-sm text-white">
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import type {
  FormInst,
  FormRules,
} from 'naive-ui'
import LogoImg from '@/assets/images/logo.svg'
import DesImg from '@/assets/images/welcome.gif'
import { VITE_APP_TITLE } from '@/utils/constants'
import { useMobile } from '@/hooks/useDevice'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const { isMobile } = useMobile()
const formRef = ref<FormInst | null>(null)
const form = reactive<ILoginForm>({
  identifier: '',
  password: '',
})
const rules = reactive<FormRules>({
  identifier: [
    { required: true, message: '请输入账号' },
  ],
  password: [
    { required: true, message: '请输入密码' },
  ],
})

function handleSubmit() {
  formRef.value?.validate(async (error) => {
    if (!error)
      appStore.login(form)
  })
}

const formAnimate = ref(true)
watch(isMobile, () => {
  formAnimate.value = false
  nextTick(() => {
    formAnimate.value = true
  })
})
</script>

<template>
  <div class="whf flex">
    <div v-if="!isMobile" class="relative h-full w-1/2 from-[var(--k-primary-color)] to-#6a11cb00 bg-gradient-to-r">
      <div class="enter-x absolute left-5 top-5 fcc overflow-hidden">
        <img :src="LogoImg" alt="logo" class="h-16 w-16 scale-120 object-cover">
        <span class="ml-2 text-xl font-700">{{ VITE_APP_TITLE }}</span>
      </div>
      <div class="absolute left-1/2 top-1/2 fcc flex-col translate-x--1/2 translate-y--1/2">
        <img :src="DesImg" alt="welcome" class="h-96 w-96">
        <span class="text-3xl font-bold">欢迎使用{{ VITE_APP_TITLE }}</span>
      </div>
    </div>
    <div class="relative h-full fcc" :class="`${isMobile ? 'w-full from-[var(--k-primary-color)] to-#6a11cb00 bg-gradient-to-r' : 'w-1/2'}`">
      <div v-if="isMobile" class="enter-x absolute left-5 top-5 fcc overflow-hidden">
        <img :src="LogoImg" alt="logo" class="h-12 w-12 scale-120 object-cover">
        <span class="ml-2 text-xl font-700">{{ VITE_APP_TITLE }}</span>
      </div>
      <ToggleTheme class="right-10 top-10 absolute!" />
      <n-form v-if="formAnimate" ref="formRef" :model="form" :rules="rules" size="small" class="rounded-lg p-4 shadow shadow-slate-300 w-80%! dark:shadow-slate-600 hover:shadow-2xl">
        <n-form-item class="enter-x">
          <h1 class="text-center text-2xl font-bold">
            登录
          </h1>
        </n-form-item>
        <n-form-item class="enter-x" path="identifier">
          <n-input
            v-model:value="form.identifier"
            placeholder="账号"
            clearable
          >
            <template #prefix>
              <div class="i-mdi:account text-base" />
            </template>
          </n-input>
        </n-form-item>
        <n-form-item class="enter-x mt-4" path="password">
          <n-input
            v-model:value="form.password" placeholder="密码" type="password"
            show-password-on="click"
            clearable
          >
            <template #prefix>
              <div class="i-mdi:lock text-base" />
            </template>
          </n-input>
        </n-form-item>
        <n-form-item>
          <n-button type="primary" attr-type="submit" class="enter-x mt-10 w-full" @click="handleSubmit">
            登录
          </n-button>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>

<route lang="json5">
{
  meta: {
    layout: 'fullscreen',
    title: '登录',
  }
}
</route>

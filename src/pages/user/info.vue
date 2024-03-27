<script lang="ts" setup>
import type {
  FormInst,
  FormRules,
} from 'naive-ui'
import ColorThief from 'colorthief'
import { getRandomColor } from '@/utils/tools'
import { localCacheStorage } from '@/utils/storage'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const userInfo = localCacheStorage.get<ILoginUserResult>('user')
const formRef = ref<FormInst | null>(null)
const form = reactive<IModifyPassword>({
  currentPassword: '',
  password: '',
  passwordConfirmation: '',
})
const rules = reactive<FormRules>({
  currentPassword: [
    { required: true, message: '请输入当前密码' },
  ],
  password: [
    { required: true, message: '请输入新密码' },
  ],
  passwordConfirmation: [
    {
      required: true,
      message: '两次输入的密码不一致',
      validator: () => {
        return form.password === form.passwordConfirmation
      },
    },
  ],
})

function handleSubmit() {
  formRef.value?.validate(async (error) => {
    if (!error)
      appStore.modifyPassword(form)
  })
}

const bgColor = ref('')
const colorThief = new ColorThief()
const headerLoading = ref(true)

const headerRef = ref<HTMLImageElement | null>(null)
onMounted(async () => {
  if (headerRef.value) {
    headerRef.value.crossOrigin = 'anonymous'
    if (headerRef.value.complete)
      handleLoad()
    else
      headerRef.value.addEventListener('load', handleLoad)
  }
})

async function handleLoad() {
  headerLoading.value = false
  let colors = await colorThief.getPalette(headerRef.value, 3)
  colors = colors.map((color: number[]) => `rgba(${color.join(',')},1)`)
  bgColor.value = colors[0]
}
</script>

<template>
  <div
    class="whf flex flex-col" :style="{
      backgroundColor: bgColor,
    }"
  >
    <div
      class="relative aspect-5/1 h-50 w-full fcc flex-shrink-0"
    >
      <n-skeleton v-if="headerLoading" class="absolute whf" />
      <img ref="headerRef" src="https://picsum.photos/2000/400" class="headerBg absolute whf">
      <div class="relative z-1 fcc flex-col">
        <n-avatar src="https://picsum.photos/200" :size="120" round />
        <span :class="`mt-4 text-xl transition-all duration-1000 text-${getRandomColor().value}`">{{ userInfo ? userInfo.username : 'Admin' }}</span>
      </div>
    </div>
    <n-card
      class="m-scrollBar mt-4 w-full flex-1"
    >
      <n-tabs class="h-full w-full" animated>
        <n-tab-pane name="1" tab="安全设置">
          <n-form ref="formRef" :model="form" :rules="rules" size="small" class="rounded-lg p-4 w-100%!">
            <n-form-item>
              <h1 class="text-center text-2xl font-bold">
                修改密码
              </h1>
            </n-form-item>
            <n-form-item path="currentPassword">
              <n-input
                v-model:value="form.currentPassword"
                placeholder="当前密码"
                type="password"
                show-password-on="click"
                clearable
              >
                <template #prefix>
                  <div class="i-mdi:lock text-base" />
                </template>
              </n-input>
            </n-form-item>
            <n-form-item class="mt-4" path="password">
              <n-input
                v-model:value="form.password" placeholder="新密码" type="password"
                show-password-on="click"
                clearable
              >
                <template #prefix>
                  <div class="i-mdi:lock-alert text-base" />
                </template>
              </n-input>
            </n-form-item>
            <n-form-item class="mt-4" path="passwordConfirmation">
              <n-input
                v-model:value="form.passwordConfirmation" placeholder="确认密码" type="password"
                show-password-on="click"
                clearable
              >
                <template #prefix>
                  <div class="i-mdi:lock-check text-base" />
                </template>
              </n-input>
            </n-form-item>
            <n-form-item>
              <n-button type="primary" attr-type="submit" class="mt-10 w-full" @click="handleSubmit">
                确认
              </n-button>
            </n-form-item>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<route lang="json5">
{
  meta: {
    title: '个人中心',
  }
}
</route>

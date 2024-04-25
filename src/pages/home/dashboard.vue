<script lang="tsx" setup>
import Logo from '@/assets/images/logo.svg'

const isDark = useDark()
const previewShow = ref(false)
const previewIndex = ref(0)
const rawPreviewImages = Array.from({ length: 3000 }).map((_, idx) => `https://picsum.photos/200/300?random=${idx}`)
const previewImages = ref<string[]>([])
interface HH {
  name: string
  age: number
  height: number
  t1: number
  t2: number
  t3: number
  t4: number
  t5: number
}
const tableOption = ref<ITableOption<HH, IPaginationProps>>({
  virtualScroll: true,
  hiddenHeader: false,
  hiddenHeaderRight: {},
  hiddenContextmenu: false,
  columns: [
    {
      key: 'name',
      title: '姓名',
      align: 'center',
      render(_, idx) {
        return (
          <img
            src={`https://picsum.photos/200/200?random=${idx}`}
            class="aspect-square w-50 object-cover"
            onClick={() => {
              previewImages.value = rawPreviewImages
              previewIndex.value = idx
              previewShow.value = true
            }}
          />
        )
      },
    },
    {
      key: 'age',
      title: '年龄',
      align: 'center',
      sorter: true,
      render(_, idx) {
        const classId = `qr-code-${idx}`
        return (
          <div
            class="aspect-square w-50 fcc"
            onClick={() => {
              const canvas = document
                .querySelector(`.${classId}`)
                ?.querySelector<HTMLCanvasElement>('canvas')
              if (canvas) {
                const url = canvas.toDataURL()
                previewImages.value = [url]
                previewIndex.value = 0
                previewShow.value = true
              }
            }}
          >
            <n-qr-code class={classId} color={isDark.value ? '#fff' : '#000'} icon-background-color="#f3f4f6e0" icon-size={30} icon-src={Logo} value={classId} background-color="#ffffff00" />
          </div>
        )
      },
    },
    {
      key: 'height',
      title: '身高',
      align: 'center',
    },
    {
      key: 't1',
      title: 't1',
      align: 'center',
    },
    {
      key: 't2',
      title: 't2',
      align: 'center',
    },
    {
      key: 't3',
      title: 't3',
      align: 'center',
    },
    {
      key: 't4',
      title: 't4',
      align: 'center',
    },
    {
      key: 't5',
      title: 't5',
      align: 'center',
    },
  ],
  data: Array.from({ length: 3000 }).map((_, index) => ({
    key: `${index}`,
    name: `name${index}`,
    age: index,
    height: index,
    t1: index,
    t2: index,
    t3: index,
    t4: index,
    t5: index,
  })),
})
</script>

<template>
  <div class="whf">
    <Table v-bind="tableOption" />
    <Preview v-if="previewShow" :images="previewImages" :index="previewIndex" :hidden="() => previewShow = false" />
  </div>
</template>

<route lang="json5">
  {
    meta: {
      title: 'dashboard',
    }
  }
  </route>

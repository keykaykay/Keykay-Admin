<script lang="ts" setup>
const router = useRouter()
const route = useRoute()

onBeforeMount(() => {
  const { params, query } = route
  const { path } = params
  router.replace({
    path: `/${Array.isArray(path) ? path.join('/') : path}`,
    query,
  })
})
</script>

<template>
  <div />
</template>

<route lang="yaml">
path: /redirect/:path(.*)
</route>

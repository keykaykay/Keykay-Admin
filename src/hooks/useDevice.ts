import { breakpointsTailwind } from '@vueuse/core'

export const useMobile = () => {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = computed(() => !breakpoints.sm.value)
  return { isMobile }
}

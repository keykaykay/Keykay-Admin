import { breakpointsTailwind } from '@vueuse/core'

export function useMobile() {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = computed(() => !breakpoints.sm.value)
  return { isMobile }
}

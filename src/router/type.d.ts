import type { RouteLocationNormalizedLoaded } from 'vue-router'

declare global {
  interface AppRouteRecordRaw
    extends Partial<RouteLocationNormalizedLoaded> {
    meta?: {
      title?: string
      icon?: string
      order?: number
    }
    [key: string]: any
  }
}

export {}

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

  type AppRouteTab = Pick<AppRouteRecordRaw, 'meta' | 'path' | 'name' | 'key'>
}

export {}

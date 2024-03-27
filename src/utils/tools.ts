import { NEllipsis, NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import generatedRoutes from 'virtual:generated-pages'
import Lodash from 'lodash-es'
import { ECHARTS_COLOR } from '@/utils/constants'

export function iconComp(icon: string) {
  return h('div', { class: icon })
}

export function renderIcon(name?: string) {
  return () =>
    h(NIcon, null, {
      default: () =>
        h('div', {
          class: name,
        }),
    })
}
export function renderLabel(title: string) {
  return () =>
    h(
      NEllipsis,
      {},
      {
        default: () => title,
      },
    )
}

export function handleRouteToMenu(item: AppRouteRecordRaw): MenuOption {
  if ((item.children.length > 0 || item.pid === '/') && !item.meta?.icon) {
    console.warn(`
    请为${item.path}路由配置index.vue
    <route lang="json5">
    {
      meta: {
        title: '???',
        icon: '???',
        order: 1
      }
    }
    </route>
  `)
  }

  const target = {
    label: renderLabel(item.meta?.title || item.name as string || item.path as string),
    // icon: renderIcon(item.meta?.icon || ''),
    key: item.path as string,
    children: item.children?.map(handleRouteToMenu) || [],
  } as MenuOption
  if (item.meta?.icon)
    target.icon = renderIcon(item.meta.icon)

  if (item.children.length === 0)
    delete target.children

  return target
}

/**
 * 将原始路由列表转换为菜单树结构。
 * @param list - 原始路由列表。
 * @returns  菜单树结构。
 */
function rawRouteToMenu(list: AppRouteRecordRaw[]): AppRouteRecordRaw[] {
  const tree: any[] = []
  const map: any = {}
  list.forEach((item) => {
    if (!item.children)
      item.children = []
    map[item.id!] = item
  })

  list.forEach((item) => {
    const parent = map[item.pid!]
    if (parent)
      parent.children.push(item)

    else
      tree.push(item)
  })
  return tree
}

/**
 * 获取菜单数据
 * @returns 菜单数据和原始数据
 */
export function getMenus() {
  const rawRoutes = generatedRoutes.filter(item => item.meta?.layout === 'default' || !item.meta?.layout) as AppRouteRecordRaw[]
  const fileterRes = Lodash.cloneDeep(rawRoutes).map((item: AppRouteRecordRaw) => {
    const paths = item.path!.split('/').filter(Boolean)
    item.paths = paths
    return item
  }).filter(item => item.paths!.length && !item.path!.includes(':all(.*)*') && !item.path!.includes('/redirect/:path(.*)')).sort((a, b) => (a?.meta?.order || Number.MAX_SAFE_INTEGER) - (b?.meta?.order || Number.MAX_SAFE_INTEGER))
  const res = Lodash.cloneDeep(fileterRes).map((item) => {
    const paths = item.paths!
    item.id = `/${paths.join('/')}`
    paths.splice(paths.length - 1, 1)
    item.pid = `/${paths.join('/')}`
    return item
  })
  const cloneRes = Lodash.cloneDeep(res)
  cloneRes.forEach((item: any) => {
    const target = res.find(tItem => tItem.path === item.pid)
    if (!target && item.pid !== '/') {
      item.paths.splice(item.paths.length - 1, 1)
      res.push({
        id: item.pid,
        pid: `/${item.paths.join('/')}`,
        path: item.pid,
        children: [],
      })
    }
  })
  return {
    menuDatas: rawRouteToMenu(res),
    rawDatas: fileterRes,
  }
}

export function handleRouteKeys(keys: string[], targetKeys: string[]) {
  if (keys.length > 2) {
    keys.pop()
    targetKeys.push(keys.join('/'))
    handleRouteKeys(keys, targetKeys)
  }
  else {
    targetKeys.push(keys.join('/'))
  }
}

/**
 * 从预定义的颜色列表中生成随机颜色，并每2.5秒更新一次。
 * @returns 随机颜色的响应式引用。
 */
export function getRandomColor() {
  const randomColor = ref(ECHARTS_COLOR[Math.floor(Math.random() * ECHARTS_COLOR.length)])
  setInterval(() => {
    randomColor.value = ECHARTS_COLOR[Math.floor(Math.random() * ECHARTS_COLOR.length)]
  }, 2500)
  return randomColor
}

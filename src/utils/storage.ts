import { aesEncryption } from './cipher'

export interface CreateStorageParams {
  prefixKey: string
  storage: Storage
  hasEncrypt: boolean
  timeout: number
}

type CacheKey = 'cacheKeys' | 'token' | 'routes' | 'user' | 'themeSettings'

class WebStorage {
  private storage: Storage
  private prefixKey?: string
  private hasEncrypt: boolean
  private timeout: number
  /**
   *
   * @param {*} storage
   */
  constructor({
    prefixKey = '',
    storage = localStorage,
    hasEncrypt = true,
    timeout = 0,
  }: Partial<CreateStorageParams> = {}) {
    this.storage = storage
    this.prefixKey = prefixKey
    this.hasEncrypt = hasEncrypt
    this.timeout = timeout
  }

  private getKey(key: CacheKey) {
    return `${this.prefixKey}${key}`.toUpperCase()
  }

  set(key: CacheKey, value: any, expire = this.timeout) {
    const stringData = JSON.stringify({
      value,
      time: Date.now(),
      expire: expire !== 0 ? new Date().getTime() + expire * 1000 : null,
    })
    const stringifyValue = this.hasEncrypt
      ? aesEncryption(stringData)
      : stringData
    this.storage.setItem(this.getKey(key), stringifyValue)
    if (key !== 'cacheKeys') {
      let keys = this.get<string[]>('cacheKeys') || []
      keys.push(key)
      keys = [...new Set(keys)]
      this.set('cacheKeys', keys)
    }
  }

  get<T = any>(key: CacheKey, def: any = null): T | void {
    const val = this.storage.getItem(this.getKey(key))
    if (!val)
      return def

    try {
      const decVal = this.hasEncrypt ? aesEncryption(val, 'decrypt') : val
      const data = JSON.parse(decVal)
      const { value, expire } = data
      if (Number(expire) === 0 || expire >= new Date().getTime())
        return value
    }
    catch (e) {
      return def
    }
  }

  /**
   * Delete cache based on key
   * @param {string} key
   * @memberof Cache
   */
  remove(key: CacheKey) {
    this.storage.removeItem(this.getKey(key))
  }

  /**
   * Delete all caches of this instance
   */
  clear(): void {
    this.get<string[]>('cacheKeys')!.forEach((key) => {
      this.remove(key as CacheKey)
    })
    this.remove('cacheKeys')
  }
}

export const localCacheStorage = new WebStorage()

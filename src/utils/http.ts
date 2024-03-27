import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { localCacheStorage } from './storage'
import { VITE_BASE_URL } from '@/utils/constants'
import router from '@/router'

interface IResponse<T> {
  code: number
  msg: string
  data: T
  [property: string]: any
}

class ZKHttp {
  private instance: AxiosInstance

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)
    this.instance.interceptors.request.use((request) => {
      const token = localCacheStorage.get('token')
      if (token)
        request.headers.Authorization = `Bearer ${token}`
      // 取消请求
      return request
    })
    this.instance.interceptors.response.use(
      (response) => {
        return response?.data || {}
      },
      (error) => {
        if (error?.response?.data?.message === 'token失效，请重新登录') {
          localCacheStorage.clear()
          router.push('/login')
          window.$message.warning('登录信息已过期，请重新登录')
          return
        }
        return error?.response?.data || { error: { message: error?.message || '请求失败' } }
      },
    )
  }

  async getMe(): Promise<boolean> {
    const user = localCacheStorage.get('user')
    const res = await this.instance.request<any, any>({ method: 'GET', url: '/users/me' })
    if (user?.loginTime !== res?.loginTime) {
      localCacheStorage.clear()
      router.push('/login')
      window.$message.warning('登录信息已过期，请重新登录')
      return false
    }
    else {
      return true
    }
  }

  async get<T = any>(config: AxiosRequestConfig<T>): Promise<any> {
    await this.getMe()
    return this.instance.request({ ...config, method: 'GET' })
  }

  post<T = any, R = AxiosResponse<T>, D = IResponse<R>>(config: AxiosRequestConfig<T>): Promise<D> {
    return this.instance.request<T, D>({ ...config, method: 'POST' })
  }

  postForm<T = any>(config: AxiosRequestConfig<T>): Promise<any> {
    return this.instance.postForm(config.url || '', config.data, config)
  }

  request<T = any, R = AxiosResponse<T>, D = IResponse<R>>(config: AxiosRequestConfig<T>): Promise<D> {
    return this.instance.request<T, D>({ method: 'POST', ...config })
  }
}

export const httpInstance = new ZKHttp({
  timeout: 0,
  baseURL: VITE_BASE_URL,
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Origin': '*',
  },
})

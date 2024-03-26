/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_BASE_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_IMG_PREFIX: string
}

declare module 'colorthief';

declare interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

interface Document {
  startViewTransition: (updateCallback: () => Promise<void> | void) => ViewTransition
}

interface ViewTransition {
  finished: Promise<void>
  ready: Promise<void>
  updateCallbackDone: Promise<void>
  skipTransition: () => void
}

interface CSSStyleDeclaration {
  viewTransitionName: string
}

interface ILoginForm {
  identifier: string
  password: string
}

interface ILoginUserResult {
  blocked: boolean
  confirmed: boolean
  createdAt: string
  email: string
  id: number
  provider: string
  updatedAt: string
  username: string
  loginTime: string
}

interface IModifyPassword {
  currentPassword: string
  password: string
  passwordConfirmation: string
}

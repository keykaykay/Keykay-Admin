import type {
  DataTableProps,
  DialogApi,
  LoadingBarApi,
  MessageApi,
  NotificationApi,
  UploadFileInfo,
} from 'naive-ui'

declare global {

  interface Window {
    $loading: LoadingBarApi
    $message: MessageApi
    $dialog: DialogApi
    $notification: NotificationApi
  }
}

export {}

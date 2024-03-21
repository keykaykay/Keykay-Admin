import '@unocss/reset/normalize.css'
import 'uno.css'
import 'animate.css'
import '@/assets/styles/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { setupLoadingDirective } from '@/directives/loading'
import { setupNaiveDiscreteApi } from '@/utils/naiveDiscreteApi'

function bootstrap() {
  const app = createApp(App)
  app.use(setupNaiveDiscreteApi)
  app.use(setupLoadingDirective)
  app.use(router)
  app.use(store)
  app.mount('#app')
}
bootstrap()

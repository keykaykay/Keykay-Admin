import process from 'node:process'
import { resolve } from 'node:path'

import type { ConfigEnv, UserConfig } from 'vite'
import { loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { createHtmlPlugin } from 'vite-plugin-html'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const isBuild = command === 'build'
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const { VITE_APP_TITLE } = env
  return {
    plugins: [
      vueJsx(),
      vue({
        include: [/\.vue$/, /\.md$/],
      }),
      Pages({
        dirs: 'src/pages',
        extensions: ['vue', 'js', 'jsx', 'tsx'],
      }),
      Layouts(),
      createHtmlPlugin({
        minify: isBuild,
        inject: {
          data: {
            title: VITE_APP_TITLE,
          },
        },
      }),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'vue/macros',
          '@vueuse/core',
          'pinia',
          {
            'naive-ui': [
              'useDialog',
              'useMessage',
              'useNotification',
              'useLoadingBar',
            ],
          },
        ],
        dts: 'src/types/auto-imports.d.ts',
        vueTemplate: true,
      }),
      Components({
        extensions: ['vue', 'md'],
        resolvers: [NaiveUiResolver()],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: 'src/types/components.d.ts',
      }),
      Unocss(),
    ],
    resolve: {
      alias: {
        '@/': `${resolve(__dirname, 'src')}/`,
      },
    },
    server: {
      host: true,
      open: true,
      port: 4012,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:1337/api',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
        '/images-api': {
          target: 'http://127.0.0.1:1337/images-api',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
        'ws://api': {
          target: 'ws://127.0.0.1:1338',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1500,
    },
  }
}

import vue from "@vitejs/plugin-vue"
import restart from 'vite-plugin-restart'

import { UserConfig, ConfigEnv, loadEnv, defineConfig } from "vite"

import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"

import Layouts from "vite-plugin-vue-meta-layouts"
import Pages from "vite-plugin-pages"

import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"

import Icons from "unplugin-icons/vite"
import IconsResolver from "unplugin-icons/resolver"

import { createSvgIconsPlugin } from "vite-plugin-svg-icons"

import { viteMockServe } from "vite-plugin-mock"

import path from "path"

const pathSrc = path.resolve(__dirname, "src");
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  return {
    base: "./",
    resolve: {
      alias: { "@": pathSrc }
    },
    css: {
      modules: {
        generateScopedName: env.VITE_USER_NODE_ENV === 'production' ? '[hash:base64:6]' : '[name]__[local]'
      },
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: `@use "@/assets/styles/variables.scss" as *;`
        }
      },
      postcss: {
        plugins: [tailwindcss(), autoprefixer()]
      }
    },
    server: {
      host: "0.0.0.0",
      port: Number(env.VITE_APP_PORT),
      open: false,
      allowedHosts: true, // For Intranet penetration
      watch: { usePolling: false }, // For non-docker environments, please set true
      proxy: {
        [env.VITE_APP_BASE_API]: {
          changeOrigin: true,
          target: env.VITE_APP_TARGET_URL,
          rewrite: path => path.replace(
            new RegExp("^" + env.VITE_APP_BASE_API),
            env.VITE_APP_TARGET_BASE_API
          )
        }
      }
    },
    plugins: [
      Pages({
        dirs: 'src/pages',
        extensions: ['vue'],
        routeStyle: 'nuxt',
        importMode: "sync",
        exclude: ['**/components/*.vue']
      }),
      Layouts({
        target: 'src/Layouts',
        defaultLayout: 'default'
      }),
      vue(),
      AutoImport({
        imports: ["vue", "@vueuse/core"],
        dirs: ["src/composable"],
        resolvers: [ElementPlusResolver(), IconsResolver({ prefix: 'i' })],
        eslintrc: {
          enabled: false,
          filepath: "./.eslintrc-auto-import.json",
          globalsPropValue: true
        },
        vueTemplate: true,
        dts: 'src/types/auto-imports.d.ts'
      }),
      Components({
        resolvers: [
          // Automatically import Element Plus components
          ElementPlusResolver(),
          // Automatically register icon components
          IconsResolver({
            enabledCollections: ["ep"],
            prefix: "i"
          })
        ],
        dirs: ["src/components"],
        dts: false
      }),

      Icons({ autoInstall: true }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(pathSrc, "assets/icons")],
        symbolId: "icon-[dir]-[name]"
      }),
      restart({
        restart: ['src/Layouts/**/*']
      }),
      viteMockServe({
        ignore: /^_/,
        mockPath: "mock",
        enable: true,
        logger: true
      })
    ],
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "pinia",
        "axios",
        "@vueuse/core",
        "sortablejs",
        "path-to-regexp",
        "echarts"
      ]
    },
    build: {
      chunkSizeWarningLimit: 2000, // Eliminate warning when package size exceeds 500kb
      minify: "terser",
      terserOptions: {
        compress: {
          keep_infinity: true, // Prevent Infinity from being compressed to 1/0, which may cause performance issues on Chrome
          drop_console: true, // Remove console method from production environment
          drop_debugger: true // Remove debugger method from production environment
        },
        format: { comments: false } // delete comment
      },
      reportCompressedSize: true
    }
  }
})

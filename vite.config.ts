import vue from "@vitejs/plugin-vue"

import { UserConfig, ConfigEnv, loadEnv, defineConfig } from "vite"

import Layouts from 'vite-plugin-vue-layouts'
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
        generateScopedName: env.VITE_USER_NODE_ENV === 'production' ? '[hash:base64:6]' : '[local]__[hash:base64:4]'
      },
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: `@use "@/assets/styles/variables.scss" as *;`
        }
      },
      postcss: {
        plugins: [require("tailwindcss"), require("autoprefixer")]
      }
    },
    server: {
      host: "0.0.0.0",
      port: Number(env.VITE_APP_PORT),
      open: false,
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
        extendRoute(route) {
          const hasRedirect = route.path.indexOf("redirect/")
          if (hasRedirect > 0 && route.meta.hidden === undefined) {
            route.meta.hidden = true
          }
          return route
        },
        importMode: "async",
        exclude: ['**/components/**/*', '**/components/*.md', '**/modules/*.vue', '**/module/*.vue']
      }),
      Layouts({
        layoutsDirs: 'src/Layouts',
        defaultLayout: 'default',
        extensions: ['vue'],
        exclude: ['**/component/*.vue', '**/components/*.vue', '**/components/*.md', '**/modules/*.vue', '**/module/*.vue']
      }),
      vue(),
      AutoImport({
        imports: ["vue", "@vueuse/core"],
        dirs: ["src/composable"],
        resolvers: [ElementPlusResolver(), IconsResolver({})],
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
          IconsResolver({ enabledCollections: ["ep"] }),
        ],
        dirs: ["src/**/components"],
        dts: false
      }),

      Icons({ autoInstall: true }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(pathSrc, "assets/icons")],
        symbolId: "icon-[dir]-[name]"
      }),
      viteMockServe({
        ignore: /^_/,
        mockPath: "mock",
        enable: true, // mode === "development"
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

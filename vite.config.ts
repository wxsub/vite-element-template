import vue from "@vitejs/plugin-vue";

import { UserConfig, ConfigEnv, loadEnv, defineConfig } from "vite";

import VueRouter from 'unplugin-vue-router/vite'
import Layouts from 'vite-plugin-vue-layouts'
import Pages from "vite-plugin-pages"

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

import { viteMockServe } from "vite-plugin-mock";

import vueJsx from "@vitejs/plugin-vue-jsx";

import UnoCSS from "unocss/vite";
import path from "path";

const pathSrc = path.resolve(__dirname, "src");
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  return {
    resolve: {
      alias: { "@": pathSrc }
    },
    css: {
      modules: {
        generateScopedName: env.VITE_USER_NODE_ENV === 'production' ? '[hash:base64:6]' : '[local]__[hash:base64:6]'
      },
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: `@use "@/assets/styles/variables.scss" as *;`
        }
      }
    },
    server: {
      host: "0.0.0.0",
      port: Number(env.VITE_APP_PORT),
      open: false,
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
      VueRouter({
        routesFolder: 'src/pages',
        extensions: ['.vue'],
        exclude: [
          '**/component/*.vue',
          '**/components/*.vue',
          '**/constant/*',
          '**/components/*.md'
        ]
      }),
      Pages({
        dirs: 'src/pages',
        extensions: ['vue'],
        exclude: ['**/component/*.vue', '**/components/*.vue', '**/components/*.md', '**/modules/*.vue', '**/module/*.vue']
      }),
      vue(),
      Layouts({
        layoutsDirs: 'src/Layouts',
        defaultLayout: 'default',
        extensions: ['vue'],
        exclude: ['**/component/*.vue', '**/components/*.vue', '**/components/*.md', '**/modules/*.vue', '**/module/*.vue']
      }),
      vueJsx(),
      UnoCSS({ hmrTopLevelAwait: false }),
      AutoImport({
        // Automatically import Vue related functions, such as: ref, reactive, toRef, etc.
        imports: ["vue", "@vueuse/core"],
        resolvers: [ElementPlusResolver(), IconsResolver({})],
        eslintrc: {
          enabled: false,
          filepath: "./.eslintrc-auto-import.json",
          globalsPropValue: true
        },
        vueTemplate: true,
        dts: false
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
        // dts: "src/types/components.d.ts"
      }),

      Icons({ autoInstall: true }),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(pathSrc, "assets/icons")],
        symbolId: "icon-[dir]-[name]"
      }),
      viteMockServe({
        ignore: /^\_/,
        mockPath: "mock",
        enable: mode === "development",
      }),
    ],
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "pinia",
        "axios",
        "element-plus/es/components/form/style/css",
        "element-plus/es/components/form-item/style/css",
        "element-plus/es/components/button/style/css",
        "element-plus/es/components/input/style/css",
        "element-plus/es/components/input-number/style/css",
        "element-plus/es/components/switch/style/css",
        "element-plus/es/components/upload/style/css",
        "element-plus/es/components/menu/style/css",
        "element-plus/es/components/col/style/css",
        "element-plus/es/components/icon/style/css",
        "element-plus/es/components/row/style/css",
        "element-plus/es/components/tag/style/css",
        "element-plus/es/components/dialog/style/css",
        "element-plus/es/components/loading/style/css",
        "element-plus/es/components/radio/style/css",
        "element-plus/es/components/radio-group/style/css",
        "element-plus/es/components/popover/style/css",
        "element-plus/es/components/scrollbar/style/css",
        "element-plus/es/components/tooltip/style/css",
        "element-plus/es/components/dropdown/style/css",
        "element-plus/es/components/dropdown-menu/style/css",
        "element-plus/es/components/dropdown-item/style/css",
        "element-plus/es/components/sub-menu/style/css",
        "element-plus/es/components/menu-item/style/css",
        "element-plus/es/components/divider/style/css",
        "element-plus/es/components/card/style/css",
        "element-plus/es/components/link/style/css",
        "element-plus/es/components/breadcrumb/style/css",
        "element-plus/es/components/breadcrumb-item/style/css",
        "element-plus/es/components/table/style/css",
        "element-plus/es/components/tree-select/style/css",
        "element-plus/es/components/table-column/style/css",
        "element-plus/es/components/select/style/css",
        "element-plus/es/components/option/style/css",
        "element-plus/es/components/pagination/style/css",
        "element-plus/es/components/tree/style/css",
        "element-plus/es/components/alert/style/css",
        "element-plus/es/components/radio-button/style/css",
        "element-plus/es/components/checkbox-group/style/css",
        "element-plus/es/components/checkbox/style/css",
        "element-plus/es/components/tabs/style/css",
        "element-plus/es/components/tab-pane/style/css",
        "element-plus/es/components/rate/style/css",
        "element-plus/es/components/date-picker/style/css",
        "element-plus/es/components/notification/style/css",
        "@vueuse/core",
        "sortablejs",
        "path-to-regexp",
        "echarts",
        "@wangeditor/editor",
        "@wangeditor/editor-for-vue"
      ],
    },
    // Build configuration
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
      }
    }
  }
})

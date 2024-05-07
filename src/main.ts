import { createApp } from "vue"
import App from "@/App.vue"
import "moment/dist/locale/zh-cn"
import { setupStore } from "@/store"
import { setupDirective } from "@/utils/directive"
import Router from '@/config/router.config'
import plugin from '@/config/plugin'

// Local SVG Icon register
import "virtual:svg-icons-register"

// Global style
import "element-plus/theme-chalk/dark/css-vars.css"
import "@/assets/styles/index.scss"
import "uno.css"

const app = createApp(App)

// Global registration custom directive (directive)
setupDirective(app)

setupStore(app)

app.use(Router).use(plugin).mount("#lg-admin-app")

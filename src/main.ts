import { createApp } from "vue"
import 'virtual:svg-icons-register'
import "element-plus/dist/index.css";
import App from "@/App.vue"
import "moment/dist/locale/zh-cn"
import { setupStore } from "@/store"
import { setupDirective } from "@/directives"
import Router from '@/config/router.config'

// Local SVG Icon register
import "virtual:svg-icons-register"

// Global style
import "element-plus/theme-chalk/dark/css-vars.css"
import "tailwindcss/tailwind.css"
import "@/assets/styles/reset.scss"

import SvgIcon from "@/components/SvgIcon/index.vue"

const app = createApp(App)

// Global registration custom directive (directive)
setupDirective(app)

setupStore(app)

app.use(Router).component("svg-icon", SvgIcon).mount("#App")

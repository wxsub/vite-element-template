import { App, Plugin, getCurrentInstance } from 'vue'
import lodash from 'lodash'
import axios from '@/config/axios.config'
import SvgIcon from "@/components/SvgIcon/index.vue"

const Plugin: Plugin = {
    install(app: App) {
        app.config.globalProperties.$http = axios
        app.config.globalProperties.$lodash = lodash
        app.component("SvgIcon", SvgIcon)
    }
}

export default Plugin

export function plugin(pluginName: any) {
  if (pluginName) {
    const { proxy }: any = getCurrentInstance();
    return proxy[pluginName]
  } else {
    console.warn(`Invalid plugin name: ${pluginName}`)
  }
}

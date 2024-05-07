import apis, { Environment } from "@/config/channel.api"
import { ElNotification } from 'element-plus'
import "element-plus/theme-chalk/el-notification.css"
type onmessageListener = (response: any) => void

const environment: Environment = import.meta.env.MODE as Environment
export default class websocket {
  private static instances: null | WebSocket = null
  private notificationInstance: any = null
  private reconnect: number = 1
  private readonly hash: string | null
  private static onMessage: onmessageListener = () => {}

  constructor(hash: string) { this.hash = hash || null }

  setMessageListener(listener: onmessageListener): void { websocket.onMessage = listener }

  async create(key: keyof typeof apis): Promise<WebSocket | null> {
    return new Promise<WebSocket | null>((resolve, reject) => {
      if (apis[key] && this.hash) {
        websocket.instances = new WebSocket(`${apis[key as keyof typeof apis][environment]}?token=${this.hash}`)
        websocket.instances.onopen = () => {
          if (this.notificationInstance) this.notificationInstance.close()
          resolve(websocket.instances)
        }
        websocket.instances.onmessage = (event: any) => {
          try {
            if (event?.data) {
              const response = JSON.parse(event.data) || {}
              if (response?.code === 200) {
                if (response?.event === 'messenger') {
                  websocket.onMessage(response)
                }
              }
            }
          } catch (e) {
            console.log(`websocket aspect raw error: ${e}`)
          }
        }
        websocket.instances.onerror = async (e: any) => {
          this.reconnect++
          if (this.reconnect <= 3) {
            await this.create(key)
          } else {
            this.clearWebsocket(key)
          }
        }
        websocket.instances.onclose = (e: any) => {
          this.Notification('网络服务已断开', '网络服务断开期间将无法收到消息通知以及信息更新，点击尝试重新建立网络服务或刷新当前页重新建立连接', async () => {
            await this.create(key)
            if (this.notificationInstance) this.notificationInstance.close()
          })
          reject(e)
        }
      } else {
        reject(`Define the websocket URL in config/channel.api.ts or hash like this(new websocket(hash))`)
      }
    })
  }
  clearWebsocket = (key: keyof typeof apis) => {
    if (websocket.instances) {
      websocket.instances.close()
      websocket.instances = null
      this.reconnect = 1
      this.Notification('网络服务已断开', '网络服务断开期间将无法收到消息通知以及信息更新，点击尝试重新建立网络服务', async () => {
        await this.create(key)
        if (this.notificationInstance) this.notificationInstance.close()
      })
    }
  }

  private readonly Notification: any = (title: string, message: string, onClick: () => void) => {
    if (this.notificationInstance) this.notificationInstance.close()
    this.notificationInstance = ElNotification({
      title,
      duration: -1,
      message,
      type: 'warning',
      onClick
    })
  }
}

export interface WebSocketInterface {
  create: (key: keyof typeof apis) => Promise<WebSocket | null>
  setMessageListener: (listener: onmessageListener) => void,
  clearWebsocket: (key: keyof typeof apis) => void
}

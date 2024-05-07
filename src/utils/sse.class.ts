import apis, { Environment } from "@/config/channel.api"
import http from "@/config/axios.config"

type onmessageListener = (response: MessageEvent) => void

const environment: Environment = import.meta.env.MODE as Environment
class ServerSentEvents {
  private eventSource: EventSource | null = null
  private static onMessage: onmessageListener = () => {}

  setMessageListener(listener: (event: MessageEvent) => void): void {
    ServerSentEvents.onMessage = listener
  }

  create(key: keyof typeof apis): Promise<EventSource | null> {
    return new Promise((resolve, reject) => {
      if ('EventSource' in window) {
        if (apis[key]) {
          this.eventSource = new EventSource(apis[key as keyof typeof apis][environment], { withCredentials: true })
          this.eventSource.onopen = () => resolve(this.eventSource)
          this.eventSource.onmessage = (event: any) => {
            try {
              ServerSentEvents.onMessage(event)
            } catch (e) {
              console.error(`Server-Sent Events aspect raw error`)
            }
          }
          this.eventSource.onerror = (e: Event) => reject(e)
        } else {
          reject(`Define the Server-Sent Events URL in config/channel.api.ts`)
        }
      } else {
        throw new Error(`Your browser does not support Server-Sent Events`)
      }
    })
  }

  sendEvent(parameter: any, url: string | null): Promise<object> {
    return new Promise(async (resolve, reject) => {
      const response: any = await http.post(url || 'www.baidu.com', parameter)
      if (response?.code === 200) {
        resolve(response.data)
      } else reject(response)
    })
  }

  closeEventSource(): void {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }
  }
}

export interface ServerSentEventsInstance {
  create: (key: keyof typeof apis) => Promise<EventSource | null>,
  closeEventSource: () => void,
  sendEvent: (parameter: any, url: string) => Promise<object>,
  setMessageListener: (listener: (event: MessageEvent) => void) => void
}

const serverSentEventsInstance: ServerSentEventsInstance = new ServerSentEvents()
export default serverSentEventsInstance

import { defineStore } from "pinia"
import { store } from "@/store"
import http from "@/config/axios.config"
import { cloneDeep, isEmpty, merge } from "lodash"

const DEFAULT_CHANNEL_FIELDS: object = { unread: 0, bucket: [] };

export interface Channel {
  readonly id: number | string;  // channel id
  readonly userid?: number | string;  // userid id
  readonly type: number | string;  // channel type, Corresponding to the backend "userType" field
  bucket?: Array<object>[]; // message bucket
  readonly nickname?: string; // channel nickname
  readonly picture?: string;  // channel picture
  unread?: number;  // unread message count
  latest?: string;  // latest news message show
  createTime?: string;  // latest news message time show
}

export const useChannelStore = defineStore("channel", () => {
  const loading = ref(false),
    users = reactive(Object.create(null)),
    channels: any = reactive(Object.create(null));

  async function loadRemoteChannels (parameters: object = {}) {
    try {
      loading.value = true
      const response: any = await http.post(`user/getGenList`, parameters)
      loading.value = false
      if (response?.code === 200) {
        const { data = [] } = response || {}
        if (Array.isArray(data) && data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            const { userid, userType, info = {}, sessionId } = data[i]
            if (isEmpty(sessionId)) continue
            setter(sessionId, merge(info, { id: sessionId, userid, type: userType }))
          }
        }
      }
    } catch (e) {
      console.log(e)
      loading.value = false
    }
  }

  async function getChannelUserInfo(userid: number | string) {
    return new Promise(async (resolve, reject) => {
      try {
        if (users[userid]) {
          resolve(users[userid])
        } else {
          const response: any = await http.post(`addressBook/getBusinessCardInformation`, { userid });
          if (response?.code === 200) {
            users[userid] = response.data
            resolve(response.data)
          } else reject(response)
        }
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  }

  function setter(channel: string, data: Channel) {
    if (channel) {
      const ChannelV = cloneDeep(channels[channel])
      channels[channel] = ChannelV ? { ...ChannelV, ...data } : merge(cloneDeep(DEFAULT_CHANNEL_FIELDS), data)
    } else console.log(`can not found channel is ${channel}`)
  }

  function getter(channel: string) {
    try {
      return cloneDeep(channels[channel]) ?? null
    } catch (e) {
      console.log(`get channel error: ${e}`)
      return {}
    }
  }

  function conversation(channel: string, data: any | undefined) {
    if (channel) {
      const ChannelData = channels[channel] || {}
      if (isEmpty(data)) {
        return ChannelData?.bucket || []
      } else if (ChannelData) {
        const { content = {} } = data || {}
        ChannelData.unread++
        if (content?.['message']) ChannelData.latest = content.message
        if (content?.['createTime']) ChannelData.createTime = content.createTime
        MessengerProcessingFactory(channel, data)
      }
    } else return null
  }

  function MessengerProcessingFactory(channel: string, value: any | undefined) {
    const ChannelData = channels[channel] || {},
      { content, ...rows } = value || {},
      { message, messageType } = content || {},
      generator = merge(rows, { content: message, type: messageType }) || {},
      bucket = cloneDeep(ChannelData.bucket) || [];
    if (value?.['codeLabel']) {
      const findIdx = bucket.findIndex((it: any) => it['codeLabel'] === value?.['codeLabel'])
      if (findIdx >= 0) {
        bucket[findIdx].content = bucket[findIdx].content + message
      } else bucket.push(generator)
    } else {
      bucket.push(generator)
    }
    channels[channel].bucket = bucket
    ScrollTo("AiRobot")
  }

  function sendMessageToBucket(channel: string, value: any | undefined) {
    if (isEmpty(channels[channel])) return
    const bucket = cloneDeep(channels[channel].bucket) || [];
    if (value?.['id']) {
      const findIdx = bucket.findIndex((it: any) => it['id'] === value?.['id'])
      findIdx >= 0 ? bucket[findIdx] = value : bucket.push(value)
    } else {
      bucket.push(value)
    }
    channels[channel].unread = 0
    channels[channel].bucket = bucket
    setter(channel, channels[channel])
  }

  function channelAddress(type: string, id: string | number) {
    if (type === 'user') {
      return `/channel/${id}`
    } else if (type && id) {
      return `/channel/${type}/#${id}`
    } else return null
  }

  return {
    channels,
    loadRemoteChannels,
    loading,
    users,
    getChannelUserInfo,
    sendMessageToBucket,
    setter,
    getter,
    conversation,
    channelAddress
  }
})

export function channelStoreHook() {
  return useChannelStore(store)
}

export function ScrollTo(elementId: string) {
  const element = document.getElementById(elementId)
  setTimeout(() => {
    if (element) element.scrollTop = element.scrollHeight
  }, 200)
}

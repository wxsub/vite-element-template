<script setup lang="ts">
import {onBeforeRouteLeave, onBeforeRouteUpdate, RouteLocationNormalized, useRouter} from "vue-router"
import VAvatar from "@/components/business/vAvatar.vue"
import { operate, conversationContent, dialogues, editor } from "@/components/channel"
import channelStyle from '@/assets/styles/modules/pages/channel.module.scss'
import { ScrollTo, useChannelStore } from "@/store/modules/channel"
import { cloneDeep, isEmpty } from "lodash"
import http from "@/config/axios.config"
import UserCard from "@/components/system/usercard.vue";
const DEFAULT_HISTORY_ROW = { list: [], total: 0, currentPage: 1 }

const router = useRouter(),
  keys = ref(""),
  loading = ref(false),
  isSending = ref(false),
  collapse = ref(false),
  historical = ref(Object.create(null)),
  { getter, sendMessageToBucket, channels, setter } = useChannelStore(),
  current = computed(() => {
    const { id } = router.currentRoute.value.params as any || {}
    if (id) {
      return channels[id] || {}
    } else return {}
  });

const MessageList = computed(() => {
  const { id } = current.value || {},
    getters = getter(id) || {};
  return getters['bucket'] || []
})

onBeforeRouteUpdate((to, from: RouteLocationNormalized, next) => {
  const id = from?.params?.id as string,
    fromChannel = id ? cloneDeep(channels[id]) || {} : {};
  fromChannel.unread = 0
  setter(id, fromChannel)
  next()
  setTimeout(() => Created(), 100)
})

onBeforeRouteLeave((to, from, next) => {
  const currentChannel = cloneDeep(current.value) || {}
  currentChannel.unread = 0
  setter(keys.value, currentChannel)
  next()
})

onMounted(() => Created())

async function sendMessage(context: string) {
  const uniq = Number(new Date()), { id, userid } = current.value || {};
  try {
    if (isEmpty(id)) return ElMessage.warning(`请选择一个会话`)
    isSending.value = true
    ScrollTo("AiRobot")
    sendMessageToBucket(id, { isOwn: true, content: context, id: uniq, loading: true })
    const response: any = await http.post("chat/sendUser", { message: context, sideId: userid, messageType: 0 })
    isSending.value = false
    if (response?.code === 200) sendMessageToBucket(id, { isOwn: true, content: context, id: uniq, loading: false })
  } catch (e) {
    sendMessageToBucket(id, { isOwn: true, content: context, id: uniq, type: -1, loading: false })
    isSending.value = false
  }
}

function operateEvent(value: number | string) {
  switch (value) {
    case 'history':
      collapse.value = !collapse.value
      break;
    default:
      break;
  }
}

async function loadRemoteHistoricalMessages() {
  try {
    if (isEmpty(keys.value)) return ElMessage.warning(`请选择一个会话`)
    loading.value = true
    const read = cloneDeep(historical.value || DEFAULT_HISTORY_ROW), response: any = await http.post("chat/loadUserHistoricalMessage", {
      sessionId: keys.value,
      currentPage: read.currentPage || 1,
      perPage: 50
    });
    loading.value = false
    if (response?.code === 200) {
      const { list = [], total, currentPage } = response?.data || {},
        currentBucket = cloneDeep(current.value);
      read.total = total
      read.currentPage = currentPage
      currentBucket.unread = 0
      currentBucket.bucket = []
      setter(keys.value, currentBucket)
      if (list.length > 0) {
        read.list = list.sort((a: any, b: any) => a['codeLabel'] - b['codeLabel'])
        ScrollTo("AiRobot")
      }
      historical.value = read
      localStorage.setItem(`message-${keys.value}`, JSON.stringify(read))
    }
  } catch (e) {
    console.log(e)
    loading.value = false
  }
}

function Created() {
  const { id } = router.currentRoute.value.params as { id: string } || {};
  if (id) {
    keys.value = id
    const currentBucket = cloneDeep(current.value),
      cache = JSON.parse(localStorage.getItem(`message-${keys.value}`) || "{}");
    if (Array.isArray(currentBucket.bucket) && currentBucket.bucket.length > 0 || isEmpty(cache)) {
      loadRemoteHistoricalMessages()
    } else {
      const { unread = 0 } = currentBucket
      if (unread > 0) {
        loadRemoteHistoricalMessages()
      } else {
        historical.value = cache
        ScrollTo("AiRobot")
      }
    }
  }
}

</script>

<template>
  <div :class="channelStyle.context">
    <div :class="channelStyle.header">
      <div class="flex flex-items-center mr-3">
        <user-card
          class="mt-2"
          trigger="hover"
          placement="bottom"
          :name="current['note'] || current['nickname'] || '佚名'"
          :userid="current.userid">
          <v-avatar
            size="36px"
            :slice="1"
            class="cursor-pointer"
            :name="current['note'] || current['nickname'] || '佚名'"
            :src="current['picture']"/>
        </user-card>
        <h5 class="ellipsis-2 flex-1">{{ current['note'] || current['nickname'] }}</h5>
      </div>
      <operate @change="operateEvent" />
    </div>
    <div :class="channelStyle.board">
      <div :class="channelStyle.chatContainer" v-loading="loading">
        <div class="flex-1 pa-5" :class="channelStyle._common" id="AiRobot">
          <el-empty
            description="空空如也~"
            v-if="MessageList.length === 0 && historical?.list?.length === 0"
            :image-size="255"
            class="mt-12vh"
            image="/images/pages/channel/bubble-gum-woman-remote-working-at-laptop.gif"/>
          <template v-else>
            <div class="flex justify-center pb-2" v-if="0">
              <el-button link :loading="1">
                加载更多
              </el-button>
            </div>
            <dialogues
              :is-own="Boolean(it.point)"
              :content="it.message"
              v-for="it in historical?.list || []"
              :key="it['codeLabel']"/>
            <dialogues
              :is-own="it.isOwn"
              :type="it.type"
              :typewriter="true"
              :loading="it.loading"
              :content="it.content"
              v-for="(it, idx) in MessageList"
              :key="idx"/>
          </template>
        </div>
        <editor @update="sendMessage" :loading="isSending" @operate="operateEvent" :maxlength="-1" />
      </div>
      <transition name="slide-fade">
        <div :class="channelStyle.sidebar" class="w-74" v-if="collapse">
          <conversation-content />
        </div>
      </transition>
    </div>
  </div>
</template>

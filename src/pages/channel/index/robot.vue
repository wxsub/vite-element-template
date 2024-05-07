<script setup lang="ts">
import { ScrollTo, useChannelStore } from "@/store/modules/channel"
import VAvatar from "@/components/business/vAvatar.vue"
import { operate, conversationContent, dialogues, editor } from "@/components/channel"
import channelStyle from '@/assets/styles/modules/pages/channel.module.scss'
import http from "@/config/axios.config"
import { isEmpty } from "lodash"

const isSending = ref(false),
  history = reactive({ loading: false, list: [] }),
  { getter, sendMessageToBucket, channels } = useChannelStore(),
  current = computed(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      return channels[hash] || {}
    } else return {}
  });

const MessageList = computed(() => {
  const { id } = current.value || {},
    getters = getter(id) || {}
  return getters['bucket'] || []
})

async function sendMessage(context: string) {
  const uniq = Number(new Date()), { id } = current.value || {};
  try {
    if (isEmpty(id)) return ElMessage.warning(`请选择一个会话`)
    isSending.value = true
    ScrollTo("AiRobot")
    sendMessageToBucket(id, { isOwn: true, content: context, id: uniq, loading: true })
    const response: any = await http.post("chat/sendRobot", { question: context })
    isSending.value = false
    if (response?.code === 200) sendMessageToBucket(id, { isOwn: true, content: context, id: uniq, loading: false })
  } catch (e) {
    sendMessageToBucket(id, { isOwn: true, content: context, id: uniq, type: -1, loading: false })
    isSending.value = false
  }
}

async function getHistoricalConversation() {
  try {
    history.loading = true
    const response: any = await http.post("addressBook/aaa")
    history.loading = false
    if (response?.code === 200) {
      return response.data
    } else throw response
  } catch (e: any) {
    console.log(e)
    history.loading = false
  }
}
</script>

<template>
  <div :class="channelStyle.context">
    <div :class="channelStyle.header">
      <div class="flex flex-items-center mr-3">
        <v-avatar
          size="36px"
          :slice="1"
          :name="current['nickname'] || '佚名'"
          :src="current['picture']"/>
        <h5 class="ellipsis-2 flex-1">{{ current['nickname'] }}</h5>
      </div>
    </div>
    <div :class="channelStyle.board">
      <div :class="channelStyle.chatContainer">
        <div class="flex-1 pa-5" :class="channelStyle._common" id="AiRobot">
          <el-empty
            description="欢迎使用机器人, 有什么可以帮您的吗？"
            v-if="Array.isArray(MessageList) && MessageList.length === 0"
            :image-size="255"
            class="mt-12vh"
            image="/images/pages/channel/color-palette-and-site-blocks.gif"/>
          <dialogues
            :is-own="it.isOwn"
            :typewriter="true"
            :type="it.type"
            v-else
            :loading="it.loading"
            :content="it.content"
            v-for="(it, idx) in MessageList"
            :key="idx"/>
        </div>
        <editor @update="sendMessage" :loading="isSending" />
      </div>
    </div>
  </div>
</template>

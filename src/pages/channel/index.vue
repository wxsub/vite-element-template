<route>{ meta: { title: "消息", layout: 'IM' } }</route>

<script setup lang="ts">
import search from "@/Layouts/structure/search/index.vue"
import { Loading, CircleCheck, ChatRound } from '@element-plus/icons-vue'
import pageCommonStyle from '@/assets/styles/modules/common.module.scss'
import channelStyle from '@/assets/styles/modules/pages/channel.module.scss'
import { useRouter } from "vue-router"
import { useChannelStore } from "@/store/modules/channel"
import VAvatar from "@/components/business/vAvatar.vue"

const router = useRouter(),
  fullPath = ref(""),
  channel = useChannelStore(),
  configs: any = computed(() => {
    const { channels = [] } = channel
    return channels
  });

watch(() => router.currentRoute.value.path, (val: string) => {
  fullPath.value = router.currentRoute.value.fullPath
}, { immediate: true })

onActivated(() => channel.loadRemoteChannels())

function menuSelect(event: string) {
  const path: string = event?.replace('&&', '#')
  router.push(path)
}
</script>

<template>
  <div :class="channelStyle.channel">
    <div :class="pageCommonStyle.Sidebar">
      <search class="mb-3" />
      <div class="px-1">
        <transition name="el-fade-in-linear">
          <div class="flex flex-items-center justify-center pt-1 pb-3 text-gray-600" v-if="channel.loading">
            <el-icon class="is-loading"><Loading /></el-icon>
            <span class="ml-1 text-xs">正在加载</span>
          </div>
        </transition>
        <el-menu
          active-text-color="#333333"
          @select="menuSelect"
          :default-active="router.currentRoute.value.fullPath?.replace('#', '&&')"
          text-color="#333333">
          <el-menu-item
            :index="channel.channelAddress(it.type, it.id)?.replace('#', '&&')"
            v-for="it in configs"
            :key="it.id">
            <el-badge
              :value="it.unread"
              class="w-9 h-9"
              :hidden="channel.channelAddress(it.type, it.id) === fullPath || it.unread === 0"
              :max="99">
              <v-avatar
                size="36px"
                :slice="1"
                :name="it.nickname"
                :src="it.picture"/>
            </el-badge>
            <div class="ml-2 flex-1 overflow-hidden">
              <div :class="channelStyle['sender-name']">
                <span class="ellipsis">{{ it['nickname'] || '佚名' }}</span>
                <time v-if="it['createTime']">{{ it['createTime'] }}</time>
              </div>
              <div :class="channelStyle['unread-content']" v-if="it['latest']">
                <el-icon :size="14">
                  <ChatRound v-if="it.unread > 0" />
                  <CircleCheck class="text-green-700" v-else />
                </el-icon>
                <span>{{ it['latest'] }}</span>
              </div>
            </div>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
    <div :class="pageCommonStyle.Container" class="flex-1">
      <router-view v-slot="{ Component }">
        <keep-alive v-if="Component && channel.loading === false">
          <component :is="Component" />
        </keep-alive>
        <el-empty
          description="每一天都是一个新的开始！"
          :image-size="255"
          class="mt-15vh"
          image="/images/pages/channel/no-message-icon.png"
          v-else />
      </router-view>
    </div>
  </div>
</template>

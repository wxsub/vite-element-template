<script setup lang="ts">
import { ChatLineRound, PhoneFilled, VideoCamera, Select, CloseBold } from '@element-plus/icons-vue'
import user from "@/assets/styles/modules/user.module.scss"
import http from "@/config/axios.config"
import { useChannelStore } from "@/store/modules/channel"
import { useRouter } from "vue-router"

const emits = defineEmits(["updated"]),
  props = defineProps({
    userid: { type: String, default: '', required: true },
    name: { type: String, default: '' },
    placement: { type: String, default: 'left' },
    trigger: { type: String, default: 'click' },
    disabled: { type: Boolean, default: false },
    showArrow: { type: Boolean, default: false },
    teleported: { type: Boolean, default: false },
    coverColor: { type: String, default: 'linear-gradient(180deg, #117EFF 2%, #0156FF 100%)' },
    offset: { type: Number, default: 0 },
    width: { type: [Number, String], default: 260 }
  }),
  router = useRouter(),
  channelStore = useChannelStore(),
  loading = ref(false),
  editConfigs = reactive([
    { label: "备注名", placeholder: "修改备注名", isEdit: false, key: 'note', loading: false }
  ]);

const nickname = computed(() => remote.value?.nickname || props.name),
  remote = computed(() => channelStore.users[props.userid] || {});

async function GetList () {
  try {
    loading.value = true
    await channelStore.getChannelUserInfo(props.userid)
    loading.value = false
  } catch (e) {
    loading.value = false
  }
}

async function modifyNoteInformation (row: any) {
  try {
    const { key } = row
    row.loading = true
    const response: any = await http.post(`addressBook/modifyNoteInformation`, {
      userid: props.userid,
      note: remote.value[key]
    });
    row.loading = false
    if (response?.code === 200) {
      row.isEdit = false
      emits("updated", FormData)
      ElMessage.success("修改成功")
    }
  } catch (e) {
    row.loading = false
  }
}

function sendMessage() {
  const { sessionId, userType, userid } = remote.value || {}
  if (sessionId) {
    const goChannel = () => {
      const path: string | null = channelStore.channelAddress(userType, sessionId)
      if (path) router.push(path)
    }
    if (channelStore.channels[sessionId]) {
      goChannel()
    } else {
      channelStore.setter(sessionId, {
        id: sessionId,
        type: userType,
        nickname: nickname.value,
        unread: 0,
        userid
      })
      goChannel()
    }
  } else {
    ElMessage.warning("未找到该用户")
  }

}
</script>

<template>
  <el-popover
    :placement="placement"
    :width="width"
    :disabled="disabled"
    @after-enter="GetList"
    :popper-style="{ padding: 0, '--cover-color': coverColor }"
    :offset="offset"
    :show-arrow="showArrow"
    :teleported="teleported"
    :trigger="trigger">
    <template #reference>
      <slot />
    </template>
    <div :class="user.UserCard" v-loading="loading">
      <div :class="user['UserCard-banner']">
        <el-image class="w-full h-full" :src="remote.picture">
          <template #error>
            <div :class="user['banner-container']">{{ nickname }}</div>
          </template>
        </el-image>
        <div :class="user['banner-operate']">
          <div class="p-4 w-full">
            <h3>{{ nickname }}</h3>
            <div class="mt-2">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="发消息"
                placement="top">
                <el-button
                  color="rgba(255, 255, 255, 0.4)"
                  class="text-white"
                  @click="sendMessage"
                  :icon="ChatLineRound"
                  circle
                  size="small" />
              </el-tooltip>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="语音通话"
                placement="top">
                <el-button
                  color="rgba(255, 255, 255, 0.4)"
                  class="text-white"
                  :icon="PhoneFilled"
                  circle
                  size="small" />
              </el-tooltip>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="语音通话"
                placement="top">
                <el-button
                  color="rgba(255, 255, 255, 0.4)"
                  class="text-white"
                  :icon="VideoCamera"
                  circle
                  size="small" />
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
      <div :class="user['UserCard-main']">
        <div
          v-for="(it, idx) in editConfigs"
          :key="idx"
          :class="user['UserCard-item']">
          <label>{{ it.label }}</label>
          <div class="flex-1">
            <el-input
              v-model="remote[it.key]"
              :placeholder="it.placeholder"
              @keydown.enter="modifyNoteInformation(it)"
              @focus="it.isEdit = true"
              @blur="it.isEdit = false">
              <template #suffix>
                <div v-if="it.isEdit">
                  <el-button text circle size="small" @click="modifyNoteInformation(it)" :loading="it.loading">
                    <el-icon><Select /></el-icon>
                  </el-button>
                </div>
              </template>
            </el-input>
          </div>
        </div>
      </div>
    </div>
  </el-popover>
</template>

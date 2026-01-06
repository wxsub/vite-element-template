<script setup lang="ts">
import { useUserStoreHook } from '@/store/modules/user'
import { useSettingsStore } from '@/store/modules/settings'
import Breadcrumb from '@/Layouts/components/Breadcrumb/index.vue'

const UserStore = useUserStoreHook()
const SettingsStore = useSettingsStore()
</script>

<template>
  <div class="h-full flex justify-between items-center">
    <div class="text-[18px] font-semibold flex items-center gap-2">
      <el-button text size="small" @click="SettingsStore.changeSetting({ key: 'showSidebar', value: !SettingsStore.showSidebar })">
        <el-icon size="18">
          <i-ep-Expand v-if="SettingsStore.showSidebar" />
          <i-ep-Fold v-else />
        </el-icon>
      </el-button>
      <Breadcrumb />
    </div>
    <div class="flex items-center gap-2">
      <span>{{ UserStore.UserData?.name }}</span>
      <el-popover
        :width="200"
        trigger="click">
        <template #reference>
          <el-avatar :size="40" :src="UserStore.UserData?.avatar" class="cursor-pointer" />
        </template>
        <ul>
          <li class="py-2 px-1 flex items-center gap-2 cursor-pointer hover:text-[#333]" @click="UserStore.logout()">
            <el-icon><i-ep-scaleToOriginal /></el-icon>
            <span>退出登录</span>
          </li>
        </ul>
      </el-popover>
    </div>
  </div>
</template>

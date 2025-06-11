<script setup lang="ts">
import { useUserStoreHook } from '@/store/modules/user'
import Breadcrumb from '@/Layouts/components/Breadcrumb/index.vue'

const UserStore = useUserStoreHook()

const visible = ref(false)
</script>

<template>
  <div class="h-full flex justify-between items-center">
    <div class="text-[18px] font-semibold">
      <Breadcrumb />
    </div>
    <div class="flex items-center gap-2">
      <span>{{ UserStore?.Dataset?.name }}</span>
      <el-popover
        v-model:visible="visible"
        :width="200"
        trigger="click">
        <template #reference>
          <el-avatar :size="40" :src="UserStore?.Dataset?.avatar" class="cursor-pointer" />
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

<script setup lang="ts">
import { useUserStoreHook } from '@/store/modules/user'
import setting from '@/config/setting'

const UserStore = useUserStoreHook()
</script>

<template>
  <div class="h-full flex justify-between items-center">
    <div class="text-[18px] font-semibold">{{ setting.title }}</div>
    <div>欢迎您， {{ UserStore?.Dataset?.name }}</div>
  </div>
</template>

<script setup lang="ts">
import { useUserStoreHook } from '@/store/modules/user'
import Breadcrumb from '@/Layouts/components/Breadcrumb/index.vue'

const UserStore = useUserStoreHook()
</script>

<template>
  <div class="h-full flex justify-between items-center">
    <div class="text-[18px] font-semibold">
      <Breadcrumb />
    </div>
    <div>欢迎您， {{ UserStore?.Dataset?.name }}</div>
  </div>
</template>

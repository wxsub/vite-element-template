<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import explain from '@/Layouts/components/Sidebar/explain.vue'

const route = useRoute()

const activeMenu = computed(() => {
  return route.path
})
</script>

<template>
  <el-scrollbar class="h-[100vh]">
    <el-menu
      :default-active="activeMenu"
      class="min-h-[100vh]"
      mode="vertical">
      <explain title="系统设置" name="setting" />
    </el-menu>
  </el-scrollbar>
</template>

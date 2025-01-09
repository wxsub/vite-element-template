<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import directory from '@/Layouts/components/Sidebar/directory.vue'

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
      <directory title="首页" />
      <directory title="系统设置" name="setting" />
      <directory title="示例" name="example" />
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRouterStoreHook } from "@/store/modules/router"
import SidebarItem from '@/Layouts/components/Sidebar/SidebarItem.vue'

interface Router {
  path: string;
  [key: string]: any;
}

const { routers } = useRouterStoreHook() as { routers: Router[] }

console.log(routers)

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
      <sidebar-item v-for="Route in routers" :key="Route.path" :item="Route" :base-path="Route.path" />
    </el-menu>
  </el-scrollbar>
</template>

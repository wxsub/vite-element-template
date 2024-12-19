<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SidebarItem from '@/Layouts/components/Sidebar/SidebarItem.vue'
import { useRouterStoreHook } from "@/store/modules/router"
import { SidebarItem as SidebarItemType } from '@/types/router'

const { routers } = useRouterStoreHook(),
  route = useRoute();

const activeMenu = computed(() => {
  return route.path
})

const RouteList = computed(() => {
  const { options = [] } = routers as { options: SidebarItemType[] }
  return options.filter(({ meta = {} }) => {
    return meta.hidden === undefined ? true : meta.hidden === false
  })
})
</script>

<template>
  <el-scrollbar class="h-[100vh]">
    <el-menu
      :default-active="activeMenu"
      class="min-h-[100vh]"
      mode="vertical">
      <sidebar-item v-for="route in RouteList" :key="route.path" :item="route" :base-path="route.path" />
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { useUserStoreHook } from '@/store/modules/user'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SidebarItem from './SidebarItem.vue'

const UserStore = useUserStoreHook()

type MenuItem = {
  name?: string
  path: string
  icon?: string
  children?: MenuItem[]
}

const route = useRoute(),
  loading = ref(false),
  menus = ref<MenuItem[]>([
    { name: '首页', path: '/' },
    { name: '权限', path: '/permissions/config' }
  ]);

const menuPathSet = computed(() => new Set(menus.value.map(it => it.path)))

const activeMenu = computed(() => {
  if (route.meta.activeMenu) return route.meta.activeMenu

  const matchedRoute = [...route.matched]
    .reverse()
    .find(r => menuPathSet.value.has(r.path))

  return matchedRoute?.path || route.path
});
</script>

<template>
  <el-scrollbar class="h-[100vh]">
    <el-menu router :default-active="activeMenu" class="min-h-[100vh]" mode="vertical" v-loading="loading">
      <sidebar-item v-for="it in menus" :key="it.path" :item="it" />
    </el-menu>
  </el-scrollbar>
</template>

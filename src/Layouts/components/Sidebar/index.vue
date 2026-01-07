<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SidebarItem from './SidebarItem.vue'

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
    { name: '权限设计说明', path: '/permissions/description' },
    { name: '数据化表单', path: '/example/formkit' },
    {
      name: '嵌套路由',
      path: '/nested',
      children: [
        { name: '嵌套路由', path: '/nested' },
        { name: '动态参数路由', path: '/nested/dynamic-parameters/12' }
      ]
    }
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

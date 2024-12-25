<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { useRouterStoreHook } from "@/store/modules/router"
import { SidebarItem as SidebarItemType } from '@/types/router'
import SidebarItem from '@/Layouts/components/Sidebar/SidebarItem.vue'

const { routers } = useRouterStoreHook()

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: null
  }
})

const Route = computed(() => {
  try {
    const router = routers.find(({ path }) => path === props.name ? `/${props.name}` : '/')
    return {  ...router, meta: { title: props.title, icon: props.icon } }
  } catch (error) {
    return {}
  }
})
</script>

<template>
  <sidebar-item :item="Route" :base-path="Route.path" />
</template>
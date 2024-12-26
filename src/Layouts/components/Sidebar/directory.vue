<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { useRouterStoreHook } from "@/store/modules/router"
import SidebarItem from '@/Layouts/components/Sidebar/SidebarItem.vue'

interface Router {
  path: string;
  [key: string]: any;
}

const { routers } = useRouterStoreHook() as { routers: Router[] }

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
    const router = routers.find(({ path }) => path === (props.name ? `/${props.name}` : '/'))
    return {  ...router, meta: { title: props.title, icon: props.icon } }
  } catch (error) {
    return { path: '', meta: { title: props.title, icon: props.icon } }
  }
})
</script>

<template>
  <sidebar-item :item="Route" :base-path="Route.path" />
</template>
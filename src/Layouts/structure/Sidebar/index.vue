<script setup lang="ts">
import scssSidebarModule from "@/assets/styles/modules/layouts/sidebar.module.scss"
import { useRouter } from 'vue-router'
import { useUserStore } from "@/store/modules/user"
import { Picture as IconPicture } from '@element-plus/icons-vue'
import User from "@/Layouts/structure/header/user.vue"

const router = useRouter(),
  { companyName } = useUserStore().user.data,
  current: any = ref(router.currentRoute.value.path),
  sideList = reactive([
    {
      path: '/channel',
      title: '消息',
      defaultIcon: '/images/layout/sidebar-message-default.png',
      activeIcon: '/images/layout/sidebar-message-active.png'
    },
    {
      path: '/dashboard',
      title: '工作台',
      defaultIcon: '/images/layout/sidebar-work-default.png',
      activeIcon: '/images/layout/sidebar-work-active.png'
    },
    {
      path: companyName ? `/contact/department` : `/contact/external`,
      title: '通讯录',
      defaultIcon: '/images/layout/sidebar-connect-default.png',
      activeIcon: '/images/layout/sidebar-connect-active.png'
    }
  ]);

watch(() => router.currentRoute.value.path, (val: string) => current.value = val)

function routeLink(path: string) {
  if (path) {
    router.push(path)
    current.value = path
  }
}

function checkActive(target: string) {
  const _cur = current.value
  return target.indexOf(_cur.match(/^\/\w+/) ? _cur.match(/^\/\w+/)[0] : '/') > -1
}
</script>

<template>
  <el-aside :class="scssSidebarModule.sidebar" width="60px">
    <user />
    <ul>
      <li
        v-for="(it, idx) in sideList as any"
        @click="routeLink(it.path)"
        :class="{ [scssSidebarModule.active]: checkActive(it.path) }"
        :key="idx">
        <el-image :src="it.activeIcon" class="w-5 h-5" v-show="checkActive(it.path)">
          <template #error>
            <div :class="scssSidebarModule['image-slot']">
              <el-icon><icon-picture /></el-icon>
            </div>
          </template>
        </el-image>
        <el-image :src="it.defaultIcon" class="w-5 h-5" v-show="!checkActive(it.path)">
          <template #error>
            <div :class="scssSidebarModule['image-slot']">
              <el-icon><icon-picture /></el-icon>
            </div>
          </template>
        </el-image>
        <p class="mt-1">{{ it.title }}</p>
      </li>
    </ul>
  </el-aside>
</template>

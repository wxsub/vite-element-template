<route>{ meta: { title: "设置", layout: 'IM' } }</route>

<script setup lang="ts">
import search from "@/Layouts/structure/search/index.vue"
import common from '@/assets/styles/modules/common.module.scss'
import setting from "@/assets/styles/modules/pages/setting.module.scss"
import { useRouter } from "vue-router"

const router = useRouter(),
  configs = [
    { name: '账号与安全', to: '/setting/account' },
    { name: '关于律观', to: '/setting/aboutUs' }
  ];
</script>

<template>
  <div :class="setting.setting">
    <div :class="common.Sidebar">
      <search class="mb-3" />
      <el-menu
        active-text-color="#333333"
        :router="true"
        :default-active="router.currentRoute.value.path"
        text-color="#333333">
        <el-menu-item
          :index="it.to"
          v-for="(it, idx) in configs"
          :key="idx">
          <el-icon>
            <img
              class="w-6 h-6"
              src="/images/pages/contact/contact-ico-2.png"
              alt="律观科技" />
          </el-icon>
          <span class="ml-1">{{ it.name }}</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div :class="common.Container" class="flex-1">
      <router-view v-slot="{ Component }">
        <keep-alive v-if="Component">
          <component :is="Component" />
        </keep-alive>
        <el-empty description="设置中心" v-else />
      </router-view>
    </div>
  </div>
</template>

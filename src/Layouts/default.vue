<template>
  <el-config-provider :size="size">
    <el-container>
      <transition name="el-fade-in">
        <el-aside :width="aside" v-if="SettingsStore.showSidebar">
          <Sidebar />
        </el-aside>
      </transition>
      <el-container>
        <el-header :height="header" class="border-b-[1px] border-[#ccc]">
          <Header />
        </el-header>
        <el-main :class="defaultLayout.main">
          <router-view v-slot="{ Component, route }">
            <keep-alive>
              <component :is="Component" :key="route.fullPath" />
            </keep-alive>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-config-provider>
</template>
<script setup lang="ts">
import Header from '@/Layouts/components/Headers/index.vue'
import Sidebar from '@/Layouts/components/Sidebar/index.vue'
import setting from '@/config/setting'
import { useSettingsStore } from '@/store/modules/settings'

const { header, aside, size } = setting

const SettingsStore = useSettingsStore()
</script>

<style module="defaultLayout" lang="scss">
.main {
  max-height: calc(100vh - v-bind(header));
  overflow-y: auto;
}
</style>
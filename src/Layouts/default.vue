<template>
  <el-config-provider :size="size">
    <el-container>
      <el-aside :width="aside">
        <Sidebar />
      </el-aside>
      <el-container>
        <el-header :height="header" class="border-b-[1px] border-[#ccc]">
          <Header />
        </el-header>
        <el-main :class="defaultLayout.main">
          <router-view v-slot="{ Component, route }">
            <transition name="router-fade" mode="out-in">
              <keep-alive>
                <section>
                  <component :is="Component" :key="route.fullPath" />
                </section>
              </keep-alive>
            </transition>
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

const { header, aside, size } = setting
</script>

<style module="defaultLayout" lang="scss">
.main {
  max-height: calc(100vh - v-bind(header));
  overflow-y: auto;
}
</style>
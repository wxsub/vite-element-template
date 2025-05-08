<template>
  <el-container>
    <el-aside :width="setting.aside">
      <Sidebar />
    </el-aside>
    <el-container>
      <el-header :height="setting.header" class="border-b-[1px] border-[#ccc]">
        <Header />
      </el-header>
      <el-main>
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
</template>
<script setup lang="ts">
import Header from '@/Layouts/components/Headers/index.vue'
import Sidebar from '@/Layouts/components/Sidebar/index.vue'
import setting from '@/config/setting'
</script>

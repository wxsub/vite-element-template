<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const activeMenu = computed(() => {
  return route.path
})
</script>

<template>
  <el-scrollbar class="h-[100vh]">
    <el-menu
      router
      :default-active="activeMenu"
      class="min-h-[100vh]"
      mode="vertical">
      <el-menu-item index="/">
        <template #title>首页</template>
      </el-menu-item>
      <el-sub-menu index="/setting/router">
        <template #title>
          <el-icon>
            <svg-icon name="home-wxsub-dark" />
          </el-icon>
          <span>设置</span>
        </template>
        <el-menu-item-group>
          <template #title>
            <span>基础设置</span>
          </template>
          <el-menu-item index="/setting/router">
            路由设置
          </el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <template #title>
            <span>高级设置</span>
          </template>
          <el-menu-item index="/setting/system">
            系统设置
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="/example/formkit">
        <template #title>
          <span>案例演示</span>
        </template>
        <el-menu-item index="/example/formkit">
          <template #title>
            formkit
          </template>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-scrollbar>
</template>

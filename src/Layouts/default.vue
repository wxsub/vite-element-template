<template>
  <el-container :class="$style['container']">
    <Sidebar />
    <el-container>
      <el-header :height="`${headerHeight}px`">
        <div :class="$style.header">
          <div>
            <el-image src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="fill" />
          </div>
          <app-header />
          <div>User Info</div>
        </div>
      </el-header>
      <el-main>
        <app-main />
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import { AppMain, AppHeader, Sidebar } from "./structure/index"
import defaultSettings from "@/config/setting"

const { headerHeight } = defaultSettings
</script>
<style module lang="scss">
.container {
  width: 100%;
  height: 100vh;
  .header {
    display: grid;
    grid-template-columns: 100px 1fr 100px;
    height: 100%;
    overflow: hidden;
  }
  .main {
    width: 100%;
    padding: 0;
    overflow-x: hidden;
  }
}
</style>

<script setup lang="ts">
import { Search, Plus } from "@element-plus/icons-vue"
import ModulesStyle from "@/assets/styles/modules/layouts/search.module.scss"
</script>

<template>
  <div class="flex px-1" :class="ModulesStyle['search-input-container']">
    <el-input
      class="flex-1"
      placeholder="搜索"
      :prefix-icon="Search"
    />
    <el-button text bg class="w-9 h-9 ml-2" :class="ModulesStyle['btn-container']">
      <el-icon><Plus /></el-icon>
    </el-button>
  </div>
</template>

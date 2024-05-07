<template>
  <el-container>
    <router-view v-slot="{ Component, route }">
      <transition name="router-fade" mode="out-in">
        <keep-alive>
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </router-view>
  </el-container>
</template>

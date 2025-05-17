<route>
{
  meta: { title: "未授权", hidden: true, layout: "fullscreen" }
}
</route>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()

console.log(route.query.type)
const title = computed(() => {
  return route.query.title
})

const content = computed(() => {
  return route.query.content
})
</script>

<template>
  <section :class="error.errorPage">
    <svg-icon name="home-something-went-wrong" class="text-[240px]" />
    <h1 class="text-slate-700 text-[24px] max-w-[70vw] break-words text-center">{{ title }}</h1>
    <div class="text-slate-500 text-[18px] mt-3 mb-4 max-w-[50vw] break-words text-center">{{ content }}</div>
    <router-link to="/">
      <el-button type="primary" round size="large">返回首页</el-button>
    </router-link>
  </section>
</template>

<style lang="scss" module="error">
.errorPage {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 24px 20px 60px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>

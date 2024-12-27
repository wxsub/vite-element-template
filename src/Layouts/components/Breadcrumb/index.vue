<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RouterItem } from '@/types/router'

const route = useRoute(),
  Router = useRouter(),
  levelList = ref<RouterItem[]>([]);

onMounted(() => getBreadcrumb())

watch(route, () => getBreadcrumb())

function handleLink(item: RouterItem) {
  const { path } = item
  Router.push(path)
}

function getBreadcrumb() {
  let matched: any = route.matched.filter(item => item.meta && item.meta.title)
  const first = matched[0]

  if (!isDashboard(first)) {
    matched = [{ path: '/', meta: { title: '首页' } }].concat(matched)
  }

  // De-duplication of matched arrays
  matched = matched.filter((item: any, index: number, self: any[]) =>
    index === self.findIndex((t) => (
      t.path === item.path
    ))
  )

  levelList.value = matched.filter((item: { meta: { title: any } }) => item.meta && item.meta.title)
}

function isDashboard(route: any) {
  const path = route && route.path
  if (!path) return false
  return path === '/'
}
</script>

<template>
  <el-breadcrumb separator="/" :separator-icon="ArrowRight">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="index == levelList.length - 1"
          class="text-[#97a8be] cursor-[text]">
          {{ item.meta?.title }}
        </span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta?.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>
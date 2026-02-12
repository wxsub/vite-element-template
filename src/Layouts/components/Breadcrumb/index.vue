<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Breadcrumbs } from '@/utils/breadcrumb-plugin'

const route = useRoute(),
  Router = useRouter(),
  levelList = ref<any[]>([]);

let breadcrumbs: any = null

onMounted(() => {
  breadcrumbs = new Breadcrumbs(Router)
  breadcrumbs.init()
  breadcrumbs.setBreadcrumbsByRoute(route)
  levelList.value = breadcrumbs.value
})

function handleLink(item: any) {
  const { link } = item
  Router.push(link)
}
</script>

<template>
  <el-breadcrumb separator="/" :separator-icon="ArrowRight">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="item in levelList" :key="item._path || item.path">
        <a @click.prevent="handleLink(item)">{{ item.label || item.meta?.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>
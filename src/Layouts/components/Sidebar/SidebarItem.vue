<template>
  <el-sub-menu v-if="Array.isArray(item.children) && item.children.length > 0" :index="item.path">
    <template #title>
      <Icon v-if="item.icon" :name="item.icon" />
      <span>{{ item.name }}</span>
    </template>
    <el-menu-item
      v-for="sub in item.children"
      :index="hasExternal(sub.path) ? '' : sub.path"
      @click="handleMixedLink(sub.path)"
      :key="sub.path">
      <template #title>
        <Icon v-if="sub.icon" :name="item.icon" />
        <span>{{ sub.name }}</span>
      </template>
    </el-menu-item>
  </el-sub-menu>

  <el-menu-item :index="hasExternal(item.path) ? '' : item.path" v-else @click="handleMixedLink(item.path)">
    <template #title>{{ item.name }}</template>
  </el-menu-item>
</template>

<script setup lang="ts">
import Icon from './Icon.vue'

defineProps({
  item: {
    type: Object,
    required: true
  }
})

const handleMixedLink = (path: string) => {
  if (hasExternal(path)) {
    window.open(path, '_blank')
  }
}

const hasExternal = (path: string) => {
  const external = ['http://', 'https://', 'mailto:', 'tel:']
  return external.some((item) => path.startsWith(item))
}
</script>

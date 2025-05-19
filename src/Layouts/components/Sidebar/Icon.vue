<template>
  <img v-if="name.startsWith('http')" :src="name" class="w-4 h-4 mr-2">
  <el-icon v-else>
    <Suspense>
      <component :is="dynamicIcon" />
    </Suspense>
  </el-icon>
</template>

<script setup lang="ts">
import * as Icons from '@element-plus/icons-vue'

const props = defineProps({
  name: {
    type: String as () => keyof typeof Icons,
    required: true
  }
})

const dynamicIcon = defineAsyncComponent({
  loader: () => Promise.resolve(Icons[props.name]),
  onError(error) {
    console.error('图标加载失败:', error);
  }
})
</script>
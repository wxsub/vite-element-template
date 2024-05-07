<script setup lang="ts">
import { computed } from "vue"
import { Picture as IconPicture } from '@element-plus/icons-vue'

const props = defineProps({
  size: { type: String, default: '36px' },
  image: { type: String, default: '' },
  slice: { type: Number, default: 2 },
  previewSrcList: { type: Array, default: () => [] },
  borderRadius: { type: String, default: '50%' },
  name: { type: String, default: '' },
  bgColor: { type: String, default: 'linear-gradient(180deg, #117EFF 2%, #0156FF 100%)' },
  fontSize: { type: String, default: '16px' }
})

const NAMES = computed(() => {
  if (props.name) return props.name.slice(0, props.slice)
});
</script>

<template>
  <el-image
    :src="image"
    :preview-src-list="previewSrcList"
    fit="cover"
    :class="$style.vAvatar">
    <template #error>
      <div :class="$style['vAvatar-error']">
        <span v-if="NAMES" class="text-white">{{ NAMES }}</span>
        <el-icon v-else><icon-picture /></el-icon>
      </div>
    </template>
  </el-image>
</template>

<style module lang="scss">
.vAvatar {
  width: v-bind(size);
  height: v-bind(size);
  line-height: 100%;
  border-radius: v-bind(borderRadius);
  &-error {
    width: 100%;
    height: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: v-bind(fontSize);
    padding: 10px 6px;
    background: v-bind(bgColor);
  }
}
</style>

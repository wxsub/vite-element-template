<script setup lang="ts">
const emits = defineEmits(["change"])
</script>

<template>
  <div class="flex flex-items-center">
    <el-button text class="px-2" @click="emits('change', 1)">
      <img src="/images/pages/channel/channel-more-icon.png" alt="律观科技" class="w-6 h-6">
    </el-button>
    <el-button text class="px-2" @click="emits('change', 2)">
      <img src="/images/pages/channel/add-contact.png" alt="律观科技" class="w-6 h-6">
    </el-button>
  </div>
</template>

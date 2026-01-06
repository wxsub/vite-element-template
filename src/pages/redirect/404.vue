<script setup lang="ts">
import { computed } from 'vue'

const message = computed(() => {
  return "您访问的页面不存在..."
})
</script>

<route>
{
  meta: { title: "404", layout: "fullscreen" }
}
</route>

<template>
  <div class="flex items-center justify-center h-[100vh]">
    <div class="relative w-[600px] py-[50px] overflow-hidden">
      <div class="relative w-full overflow-hidden">
        <img class="w-[100%]" src="/404_images/404.png" alt="404">
        <img class="absolute w-[80px] top-[17px] left-[220px]" src="/404_images/404_cloud.png" alt="404">
        <img class="absolute w-[46px] top-[10px] left-[420px]" src="/404_images/404_cloud.png" alt="404">
        <img class="absolute w-[62px] top-[100px] left-[500px]" src="/404_images/404_cloud.png" alt="404">
      </div>
      <div class="relative overflow-hidden px-[30px] mt-[20px]">
        <div class="text-[32px] text-[#1482f0] mb-[20px] font-semibold">OOPS!</div>
        <div class="text-[13px] text-[grey] mb-[30px]">
          All rights reserved
          <a class="text-[#20a0ff]" href="https://wxsub.com" target="_blank">wxsub.com</a>
        </div>
        <div class="text-[20px] text-[#222] mb-[10px] font-semibold">{{ message }}</div>
        <div class="text-[13px] text-[grey] mb-[30px]">
          请检查您输入的 URL 是否正确，或点击下面的按钮
          返回主页。
        </div>
        <a href="/" class="inline-block px-[12px] h-[36px] text-white bg-[#1482f0] leading-[36px] rounded-[100px] text-center">返回主页</a>
      </div>
    </div>
  </div>
</template>
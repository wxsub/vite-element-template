<script setup lang="ts">
import Items from "@/components/business/contact/items.vue"
import contact from "@/assets/styles/modules/contact.module.scss"
</script>

<template>
  <div>
    <div :class="contact.header">
      <span>我的群组</span>
    </div>
    <div :class="contact.main">
      <Items name="政儿" class="mt-2" />
    </div>
  </div>
</template>

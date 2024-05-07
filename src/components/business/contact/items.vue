<script setup lang="ts">
import VAvatar from "@/components/business/vAvatar.vue"
import userItem from "@/assets/styles/modules/user.module.scss"
defineProps({
  src: { type: String },
  fontSize: { type: String, default: "12px" },
  size: { type: String, default: "36px" },
  name: { type: String },
  description: { type: String }
})
</script>

<template>
  <div :class="userItem['user-item-container']">
    <v-avatar
      :size="size"
      :name="name"
      :src="src"
      :font-size="fontSize"
      border-radius="50%"
      bg-color="linear-gradient(180deg, #117EFF 2%, #0156FF 100%)" />
    <div class="flex-1 overflow-hidden">
      <div>
        <slot name="name" v-if="$slots.name"></slot>
        <div v-else-if="name">{{ name }}</div>
      </div>
      <div :class="[userItem.itemDescription]">
        <slot name="description" v-if="$slots.description"></slot>
        <div v-else-if="description">
          {{ description }}
        </div>
      </div>
    </div>
    <slot name="append"></slot>
  </div>
</template>

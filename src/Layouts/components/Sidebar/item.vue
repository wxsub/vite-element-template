<template>
  <div>
    <svg-icon v-if="icon" :name="icon" />
    <span v-if="title">{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})

const { icon, title } = props
</script>

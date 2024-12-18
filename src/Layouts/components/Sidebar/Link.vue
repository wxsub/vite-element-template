<script setup lang="ts">
import { isExternal } from '@/utils/validate'
import { computed } from 'vue'

const props = defineProps({
  to: {
    type: String,
    required: true
  }
})

const external = computed(() => {
  return isExternal(props.to)
})

const type = computed(() => {
  if (external) return 'a'
  return 'router-link'
})

const linkProps = () => {
  if (external) {
    return {
      href: props.to,
      target: '_blank',
      rel: 'noopener'
    }
  }
  return {
    to: props.to
  }
}
</script>

<template>
  <component :is="type" v-bind="linkProps()">
    <slot />
  </component>
</template>

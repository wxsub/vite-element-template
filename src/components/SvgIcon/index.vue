<template>
  <svg
    aria-hidden="true"
    :class="svgIcon['svg-icon']">
    <use :href="symbolId" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps({
  prefix: {
    type: String,
    default: "icon",
  },
  name: {
    type: String,
    required: false,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "1em",
  }
});

const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>

<style lang="scss" module="svgIcon">
.svg-icon {
  display: inline-block;
  width: v-bind(size);
  height: v-bind(size);
  overflow: hidden;
  vertical-align: -0.15em;
  outline: none;
  fill: currentcolor;
}
</style>

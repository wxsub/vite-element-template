<script setup lang="ts">
import user from "./user.vue"
</script>

<template>
  <header :class="$style['imHeader']">
    <user />
    <div></div>
  </header>
</template>

<style module lang="scss">
.imHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
}
</style>

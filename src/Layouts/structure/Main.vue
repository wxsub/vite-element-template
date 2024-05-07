<template>
  <div class="im-app-container">
    <router-view v-slot="{ Component, route }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<style lang="scss">
.im-app-container {
  position: relative;
}
</style>

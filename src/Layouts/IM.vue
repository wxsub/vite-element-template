<template>
  <main :class="scssLayoutModule.common">
    <section>
      <div :class="scssLayoutModule.slider">
        <Sidebar />
        <company />
      </div>
      <app-main class="flex-1 overflow-x-hidden" />
    </section>
  </main>
</template>

<script lang="ts" setup>
import { AppMain, Sidebar, company } from "./structure/index"
import scssLayoutModule from "@/assets/styles/modules/layouts/layout.module.scss"
</script>

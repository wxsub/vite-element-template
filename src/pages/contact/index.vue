<route>{ meta: { title: "通讯录", layout: 'IM' } }</route>

<script setup lang="ts">
import search from "@/Layouts/structure/search/index.vue"
import { useContactStore } from "@/store/modules/contacts"
import contact from "@/assets/styles/modules/contact.module.scss"
import { useRouter } from "vue-router"

const List: any = useContactStore().MenuList, router = useRouter();

function LinkTo(row: any) {
  if (row?.key) router.push(`/contact/${row.key}`)
}

function isActive(row: any) {
  const { path } = router.currentRoute.value as any
  return `/contact/${row.key}` === path
}
</script>

<template>
  <div :class="contact.ContactContainer">
    <div :class="contact.Sidebar">
      <div>
        <search />
      </div>
      <ul class="mt-3" :class="contact.SidebarContainer">
        <template v-for="(it, idx) in List" :key="idx">
          <div class="px-2" v-if="it.type === 'divider'"><el-divider /></div>
          <li v-else @click="LinkTo(it)" :class="{ [contact._active]: isActive(it) }">
            <img :src="`/images/pages/contact/${it.icon}`" alt="律观科技" />
            <div>{{ it.title }}</div>
          </li>
        </template>
      </ul>
    </div>
    <div :class="contact.container" class="flex-1">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-divider--horizontal) { margin: 6px 0; border-top: 1px solid #F2F3F5 }
</style>

<script setup lang="ts">
import { isExternal } from '@/utils/validate'
import item from '@/Layouts/components/Sidebar/item.vue'
import AppLink from '@/Layouts/components/Sidebar/Link.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => {}
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ''
  }
})
let onlyOneChild:any = null

const hasOneShowingChild = (children = [], parent: any) => {
  const showingChildren = children.filter(item => {
    if (item?.hidden) {
      return false
    } else {
      // Temp set(will be used if only has one showing child)
      onlyOneChild = item
      return true
    }
  })

  // When there is only one child router, the child router is displayed by default
  if (showingChildren.length === 1) {
    return true
  }

  // Show parent if there are no child router to display
  if (showingChildren.length === 0) {
    onlyOneChild = { ... parent, path: '', noShowingChildren: true }
    return true
  }

  return false
}

const resolvePath = (routePath: string) => {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  const normalizedBasePath = props.basePath.replace(/\/+$/, '')
  const normalizedRoutePath = routePath.replace(/^\/+/, '')

  return `${normalizedBasePath}/${normalizedRoutePath}`
}
</script>

<template>
  <div>
    <template
      v-if="hasOneShowingChild(props.item.children, props.item)
      &&
      (!onlyOneChild.children || onlyOneChild.noShowingChildren)">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)">
          <item :icon="onlyOneChild.meta.icon||(item.meta && item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu v-else ref="subMenu" :index="resolvePath(props.item.path)" popper-append-to-body>
      <template #title>
        <item v-if="props.item.meta" :icon="props.item.meta && props.item.meta.icon" :title="props.item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in props.item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </div>
</template>

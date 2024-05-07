<script setup lang="ts">
import { Search } from "@element-plus/icons-vue"
import Items from "@/components/business/contact/items.vue"

const activeName = ref("first")
</script>

<template>
  <div class="px-4 pt-4 pb-1">搜索会话内容</div>
  <div :class="$style.conversationContent">
    <el-tabs v-model="activeName">
      <el-tab-pane label="消息" name="first" />
      <el-tab-pane label="链接" name="1" disabled />
    </el-tabs>
    <div class="px-4 pt-4">
      <el-input
        placeholder="搜索"
        :prefix-icon="Search"
      />
    </div>
    <div class="py-4" :class="$style.context">
      <el-empty
        description="未匹配到结果！"
        :image-size="175"
        class="mt-15"
        image="/images/pages/channel/conversation-zero-icon.png" />
      <items
        name="比克大魔王"
        v-if="0"
        description="你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好"
        :class="$style.item"
        class="mb-2">
        <template #name>
          <div :class="$style['item-name']">
            <span>比克大魔王</span>
            <time class="ml-3">2023年12月31日</time>
          </div>
        </template>
      </items>
    </div>
  </div>
</template>

<style module lang="scss">
.conversationContent {
  height: calc(100% - 45px);
  .context {
    height: calc(100% - 88px);
    overflow-x: hidden;
    @include scrollbar;
    .item {
      align-items: flex-start;
      .item-name {
        font-size: 12px;
        color: #8f959e;
        line-height: 16px;
      }
    }
  }
  :global .el-tabs__header { margin: 0 }
  :global .el-tabs__item { color: #666666 }
  :global .is-active { color: #1456F0 }
  :global .el-tabs__nav-wrap {
    padding: 0 13px;
    &:after { height: 1px; background-color: rgba(0,0,0,0.16) }
  }
}
</style>

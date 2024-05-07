<script setup lang="ts">
const props = defineProps({
  type: { type: Number, default: 0 }, // 0: 文本消息、1：图片链接、2：音频（m3u8）、3: 视频（m3u8）、4：文件
  loading: { type: Boolean, default: false },
  maxlength: { type: Number, default: 1500 },
  content: { type: String, default: '' }
}), emits = defineEmits(["update", "operate"]);

let context:any = ref(props.content), collapse = ref(false);

function handleKeyDown(event: any) {
  if (event.ctrlKey && event.key === 'Enter') {
    context.value += '\n';
  } else send()
}

function send() {
  emits('update', context.value)
  setTimeout(() => {
    context.value = ''
  }, 50)
}
</script>

<template>
  <div :class="$style.editor">
    <div :class="$style.operate">
      <div>
        <el-button text class="px-2">
          <img src="/images/pages/channel/picture-icon.png" alt="律观科技" class="w-5 h-5">
        </el-button>
        <el-button text class="px-2">
          <img src="/images/pages/channel/file-icon.png" alt="律观科技" class="w-5 h-5">
        </el-button>
        <el-button text class="px-2" @click="emits('operate', 'history')">
          <img src="/images/pages/channel/history-icon.png" alt="律观科技" class="w-5 h-5">
        </el-button>
      </div>
    </div>
    <div class="relative" :class="$style.textarea">
      <el-input
        :autosize="{ minRows: 5, maxRows: 5 }"
        type="textarea"
        v-model="context"
        resize="none"
        @keydown.enter="handleKeyDown"
        :maxlength="maxlength === -1 ? undefined : maxlength"
        show-word-limit
        :input-style="{ 'borderRadius': '0 0 14px 14px' }"
        size="large"
        placeholder="输入聊天内容"
      />
      <div :class="$style.sendButton">
        <el-button text type="primary" :disabled="!context" @click="send" :loading="loading">
          {{ loading ? '发送中...' : '发送(S)' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
.editor {
  $contextHeight: 120px;
  border-top: 1px solid #F2F3F5;
  .operate {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    :global .el-button+.el-button { margin-left: 6px }
  }
  .textarea {
    height: $contextHeight;
    :global .el-textarea__inner { box-shadow: none }
    .sendButton {
      position: absolute;
      bottom: 14px;
      right: 10px;
    }
  }
}
</style>

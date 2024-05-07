<script setup lang="ts">
import { Warning, Loading } from '@element-plus/icons-vue'
import MarkdownIt from 'markdown-it'

let typewriterString: any = ref("")
const props = defineProps({
  type: { type: Number, default: 0 }, // -1: 错误、0: 文本消息、1：图片链接、2：音频（m3u8）、3: 视频（m3u8）、4：文件
  content: { type: String, default: null },
  loading: { type: Boolean, default: false },
  typewriter: { type: Boolean, default: false },
  isOwn: { type: Boolean, default: false }
}), hash = Number(new Date()).toString();

const md = new MarkdownIt(),
  background = computed(() => {
    if (props.type === -1) return "#f56c6c"
    if (props.type === 0) return props.isOwn ? "#E7F0FF" : "#E4E7EB"
  }), color = computed(() => {
    if (props.type === -1) return "#FFFFFF"
    return "#333333"
  });

watch(() => props.content, (val) => {
  typewriterString.value = props.content
  // if (props.typewriter) typewriterAnimate(val)
}, { immediate: true })

function typewriterAnimate(str: string) {
  const renderList = [str],
    fonts = str.replace(/<[^>]+>/g,'').split("");
  let j = 0
  for(let i = fonts.length - 1; i >= 0; i--) {
    const html = renderList[j++]
    renderList.push(html.slice(0, -1))
  }
  const timer = setInterval(() => {
    if (renderList.length) {
      typewriterString.value = renderList.pop()
    } else {
      clearInterval(timer)
    }
  }, 100)
}

function escapeHTML(content: string) {
  try {
    return props.isOwn ?
      content.replace(/</g, '&lt;').replace(/>/g, '&gt;') :
      md.render(content)
  } catch (e) {
    return ''
  }
}
</script>

<template>
  <div :class="[$style.dialogues, { 'text-right': isOwn } ]" v-if="content">
    <div
      class="inline-block"
      :class="$style['context']"
      :id="hash"
      v-if="typewriter && !isOwn"
      v-html="escapeHTML(typewriterString)" />
    <div
      class="inline-block"
      :class="$style['context']"
      v-html="escapeHTML(content)"
      v-else />
    <div v-if="loading">
      <p :class="$style['loading']">
        <el-icon class="is-loading">
          <Loading />
        </el-icon>
        <span class="inline-block">正在发送</span>
      </p>
    </div>
    <p v-if="type === -1" :class="$style['errorMsg']">
      <el-icon :size="14" class="mt-3 inline-block"><Warning /></el-icon>
      <span class="ml-1">消息发送失败</span>
    </p>
  </div>
</template>

<style module lang="scss">
.dialogues {
  max-width: 100%;
  overflow-y: hidden;
  overflow-x: auto;
  & + & { margin-top: 10px }
  .context {
    background: v-bind(background);
    color: v-bind(color);
    @extend .__common;
    * { white-space: break-spaces }
  }
  .__common {
    border-radius: 4px;
    max-width: 100%;
    padding: 10px;
    word-break: break-all;
    &:hover { opacity: .88 }
  }
  .errorMsg {
    overflow: hidden;
    font-size: 12px;
    color: v-bind(background);
    margin-top: -4px;
  }
  .loading {
    display: inline-flex;
    align-items: center;
    font-size: 12px;
    color: #666;
    gap: 3px;
    user-select: none;
    margin-top: 5px;
  }
}
</style>

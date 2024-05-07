<script setup lang="ts">
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { Search } from "@element-plus/icons-vue"
import { copyText } from "@/utils/directive/copyText"

const props = defineProps({
  modelValue: { type: Boolean, default: true },
  title: { type: String, default: "添加企业成员" }
}), emits = defineEmits(["update:modelValue"]);

let visible = computed({
  get() { return props.modelValue },
  set(newValue) { emits('update:modelValue', newValue) }
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :class="$style.addUserDialog"
    width="520px">
    <template #header>
      <h3>{{ title }}</h3>
    </template>
    <template #default>
      <el-input placeholder="搜索手机号" size="large" class="z-1" :prefix-icon="Search" />
      <div class="mt-4" :class="$style.context">
        <div :class="$style.mode">
          <h5>分享链接</h5>
          <p>分享链接到工作群、邮件组，快速邀请你的同事加入</p>
          <div class="bg-gray-100 pa-2 mt-2 text-slate-400">https://q2jq49vnir.feishu.cn/invite/memhttps://q2jq49vnir.feishu.cn/invite/mem</div>
          <div class="mt-4 text-right">
            <el-button type="primary" plain size="small" @click="copyText('https://q2jq49vnir', '链接已复制')">复制</el-button>
          </div>
        </div>
        <div :class="$style.mode">
          <h5>分享二维码</h5>
          <p>对方可扫描二维码，将你添加为外部联系人</p>
          <div class="mt-4 flex flex-justify-between w-full flex-items-end">
            <el-image class="w-20 h-20">
              <template #error>
                <div class="w-20 h-20 bg-gray-100 flex flex-items-center justify-center">
                  <el-icon class="font-size-10"><icon-picture /></el-icon>
                </div>
              </template>
            </el-image>
            <el-button type="primary" plain size="small" @click="copyText('https://q2jq49vnir', '二维码已复制')">保存</el-button>
          </div>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<style module lang="scss">
.addUserDialog {
  text-align: left;
  font-weight: 400;
  h3 {
    font-size: 20px;
    color: #333333;
  }
  .context {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border-radius: 6px;
    opacity: 1;
    border: 1px solid #EDEDED;
    overflow: hidden;
    .mode {
      border-right: 1px solid #EDEDED;
      padding: 14px 14px 20px;
      font-size: 14px;
      line-height: 20px;
      word-break: break-all;
      &:last-child { border-right: none }
      h5 {
        font-size: 15px;
        font-weight: 400;
        color: #333333;
      }
      p { margin-top: 10px }
    }
    &:after {
      position: absolute;
      display: inline-block;
      content: "";
      background: url("/images/system/addUser-dialog-bg.png");
      background-size: 330px 95px;
      width: 330px;
      height: 95px;
      top: 0;
      right: 16px;
      z-index: 0;
    }
  }
  :global .el-dialog__headerbtn { z-index: 1 }
  :global .el-dialog__body { padding: 10px 20px 40px }
  :global .el-input__wrapper { background: transparent }
}
</style>

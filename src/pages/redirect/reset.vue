<route>{ meta: { title: "重置密码", layout: "blank" } }</route>

<script setup lang="ts">
import router from "@/config/router.config"
const FormData: any = reactive({})
</script>

<template>
  <div :class="$style.resetPassword">
    <div :class="$style.context">
      <h1 class="mt-0">重置密码</h1>
      <el-form :model="FormData" size="large" class="mt-2">
        <el-form-item>
          <el-input v-model="FormData.name" placeholder="请输入手机号">
            <template #prefix>
              <el-image src="/images/redirect/login-user-icon.png" class="h-6 mt-1" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="FormData.password" placeholder="请输入验证码">
            <template #prefix>
              <el-image src="/images/redirect/login-password-icon.png" class="h-6 mt-1" />
            </template>
            <template #append>
              <el-button>获取验证码</el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="mt-8">
          <el-button type="primary" class="w-full" size="large">下一步</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style module lang="scss">
.resetPassword {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  .context {
    width: 380px;
    background: #ffffff;
    padding: 20px 20px 10px;
    text-align: center;
    border-radius: 5px;
  }
}
</style>

<route lang="json">
{
  "meta": { "title": "登录", "layout": "fullscreen" }
}
</route>

<template>
  <div class="h-[100vh] w-[100vw] flex justify-center bg-[#333]">
    <div class="mt-[20%] text-white">
      <h1 class="text-[32px] font-semibold text-center">登录</h1>
      <div class="w-[420px] mt-6">
        <el-form size="large" @keyup.enter.native="login">
          <el-form-item label-position="top">
            <el-input v-model="formData.accountNo" placeholder="请输入账号"/>
          </el-form-item>
          <el-form-item label-position="top">
            <el-input v-model="formData.password" type="password" placeholder="请输入密码" />
          </el-form-item>
        </el-form>
        <el-button color="#626aef" class="w-full mt-3" size="large" @click="login" :loading="data.loading">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/store/modules/user"

const data = reactive({
  loading: false,
  data: null
})

const formData = reactive({
  accountNo: '',
  password: '',
})

const login = async () => {
  try {
    data.loading = true
    await useUserStore().login(formData)
    data.loading = false
    location.reload()
  } catch (error) {
    console.log(error)
  } finally {
    data.loading = false
  }
}
</script>

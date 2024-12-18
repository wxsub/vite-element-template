<route>
{
  meta: { title: "注册", roles: [1], layout: "fullscreen" }
}
</route>

<template>
  <div class="h-[100vh] w-[100vw] flex justify-center bg-[#333]">
    <div class="mt-[20%] text-white">
      <h1 class="text-[32px] font-semibold text-center">注册</h1>
      <div class="w-[420px] mt-6">
        <el-form size="large">
          <el-form-item label-position="top">
            <el-input v-model="formData.account" placeholder="请输入账号"/>
          </el-form-item>
          <el-form-item label-position="top">
            <el-input v-model="formData.password" type="password" placeholder="请输入密码" />
          </el-form-item>
        </el-form>
        <el-button color="#626aef" class="w-full mt-3" size="large" @click="register" :loading="data.loading">立即注册</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useUserStore } from "@/store/modules/user"

const data = reactive({
  loading: false,
  data: null
})

const formData = reactive({
  account: 'admin',
  password: 'admin',
})

const register = async () => {
  try {
    // data.loading = true
    // await useUserStore().login(data)
    // data.loading = false
    console.log("register")
  } catch (error) {
    console.log(error)
  }
}
</script>

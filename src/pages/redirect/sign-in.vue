<route>{ meta: { title: "登录律观IM", layout: "blank" } }</route>

<script setup lang="ts">
import { useUserStore } from "@/store/modules/user"
import { Picture as IconPicture, User, Lock, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { concat } from "lodash"
import VAvatar from "@/components/business/vAvatar.vue";
const active = ref(1)

const LoginForm: any = reactive({
  step: 1,
  countdown: 60,
  company: [],
  protocol: false,
  loading: false,
  value: { mobilePhone: null, password: '123456', validate: '', nickname: `user-${Number(new Date())}` },
  mobilePhoneConf: [
    {
      key: 'mobilePhone',
      type: 'input',
      props: { prefixIcon: User, placeholder: "请输入你的手机号码", class: 'w-full' }
    }
  ],
  passwordConf: [
    {
      key: 'password',
      type: 'input',
      props: { prefixIcon: Lock, placeholder: "密码", class: 'w-full' }
    }
  ],
  msgCodeConf: [
    {
      key: 'validate',
      type: 'input',
      props: { placeholder: "输入手机号验证码", class: 'w-full' }
    }
  ],
  registerConf: [
    {
      label: '昵称',
      key: 'nickname',
      type: 'input',
      props: { placeholder: "请输入", class: 'w-full' }
    },
    {
      label: '设置密码',
      key: 'password',
      type: 'input',
      props: { placeholder: "请输入", class: 'w-full' }
    },
    {
      label: '确认密码',
      key: 'ConfirmPassword',
      type: 'input',
      props: { placeholder: "请输入", class: 'w-full' }
    },
    {
      label: '短信验证码',
      key: 'validate',
      type: 'input',
      props: { placeholder: "请输入", class: 'w-full' }
    }
  ]
})

const configs = computed(() => {
  if (LoginForm.step === 1) return active.value === 1 ? LoginForm.mobilePhoneConf : concat(LoginForm.mobilePhoneConf, LoginForm.passwordConf)
  if (LoginForm.step === 2) return LoginForm.msgCodeConf
  if (LoginForm.step === 3) return LoginForm.passwordConf
  if (LoginForm.step === 4) return LoginForm.registerConf
}), canRegister = computed(() => {
  const { ConfirmPassword, validate, password, nickname } = LoginForm.value
  if (ConfirmPassword && validate && password && nickname) {
    return !(/^(?=(\w*\d))(?=(\w*[a-zA-Z]))[\w!@#$%^&]{8,}$/.test(password)) || !(password === ConfirmPassword)
  }
  return true
});

const passwordLogin = async () => {
  try {
    LoginForm.loading = true
    const { mobilePhone, password } = LoginForm.value
    const response = await useUserStore().login({
      mobilePhone: Number(mobilePhone),
      password
    })
    complete(response)
  } catch (e: any) {
    LoginForm.loading = false
    if (e['returnCode'] === 3) LoginForm.step = 4
  }
}

const VerificationCodeLogin = async () => {
  const { mobilePhone, validate } = LoginForm.value
  try {
    LoginForm.loading = true
    const response = await useUserStore().VerificationCodeLogin({
      mobilePhone: Number(mobilePhone),
      validate: Number(validate)
    })
    complete(response)
  } catch (e: any) {
    LoginForm.loading = false
    if (e.code === 404) {
      const response = await sendMessage(Number(mobilePhone), 'register')
      console.log(response)
      LoginForm.value.validate = null
      LoginForm.step = 4
    }
  }
}

const register = async () => {
  try {
    LoginForm.loading = true
    const { mobilePhone, validate, password, nickname } = LoginForm.value
    const response = await useUserStore().register({
      mobilePhone: Number(mobilePhone),
      validate: Number(validate),
      password,
      nickname
    })
    complete(response)
  } catch (e: any) {
    LoginForm.loading = false
  }
}

async function sendMessage(mobilePhone: any, scenes: String = 'login') {
  try {
    LoginForm.loading = true
    const response: any = await useUserStore().getMsgCode({
      mobilePhone
    }, scenes)
    LoginForm.loading = false
    if (response?.code === 200) {
      resetCountdown()
      if (scenes === "login") LoginForm.step = 2
    } else ElMessage.warning(`发送验证码失败`)
  } catch (e) {
    LoginForm.loading = false
    console.log(e)
  }
}
function resetCountdown() {
  if (LoginForm.countdown <= 0) {
    clearInterval(LoginForm.Interval)
    LoginForm.countdown = 60
  } else {
    LoginForm.Interval = setInterval(() => {
      LoginForm.countdown--
      if (LoginForm.countdown <= 0) {
        clearInterval(LoginForm.Interval)
        LoginForm.countdown = 60
      }
    }, 1000)
  }
}

function FirstStep(active: number = 1) {
  if (LoginForm.protocol) {
    switch (active) {
      case 1:
        sendMessage(Number(LoginForm.value.mobilePhone))
        break
      case 2:
        passwordLogin()
        break
    }
  } else ElMessage.warning('阅读服务协议以继续')
}

function complete(response: any) {
  const data = response.data || {}
  LoginForm.loading = false
  if (data?.token) LoginForm.value.token = data.token
  if (data?.table) LoginForm.company = data.table
  LoginForm.step = 5
}

async function selectEnterprise(userid: string) {
  const { token } = LoginForm.value
  if (token && userid) {
    await useUserStore().selectEnterprise(userid, token)
    window.location.reload()
  }
}
</script>

<template>
  <div class="sign-in">
    <div class="sign-in-container">
      <el-image class="banner" src="/images/redirect/login-left-banner.png">
        <template #error>
          <div class="image-slot">
            <icon-picture />
            <p>加载失败</p>
          </div>
        </template>
      </el-image>
      <!-- 手机号输入 -->
      <div class="sign-in-context pt-23" v-if="LoginForm.step === 1">
        <h1>欢迎使用律观IM</h1>
        <div>
          <ul class="sign-in-tab">
            <li :class="{ 'active': active === 1 }" @click="active = 1">手机号</li>
            <li :class="{ 'active': active === 2 }" @click="active = 2">密码</li>
          </ul>
          <form-kit
            :config="configs"
            :row-gap="20"
            class="mt-6"
            v-model="LoginForm.value"
            size="large"
            :block="true"
          />
          <el-checkbox v-model="LoginForm.protocol" size="large" class="mt-3">
            <span class="protocol">
              我已阅读并同意
              <a href="javascript:;">服务协议</a>
              和
              <a href="javascript:;">服务协议</a>
            </span>
          </el-checkbox>
        </div>
        <el-button
          color="#0D75FF"
          :loading="LoginForm.loading"
          class="mt-8 w-full"
          :disabled="!(/^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9])\d{8}$/.test(LoginForm.value.mobilePhone))"
          @click="FirstStep(active)"
          size="large">
          下一步
        </el-button>
        <p class="text-center sign-in-bottom">
          还没有企业？
          <a href="javascript:;">立即注册企业</a>
        </p>
      </div>
      <!-- 手机号验证码输入 -->
      <div class="sign-in-context pt-13" v-if="LoginForm.step === 2">
        <div class="mb-1">
          <div class="inline-flex back-btn" @click="LoginForm.step = 1">
            <el-icon><ArrowLeft /></el-icon>
            <span class="ml-1">返回</span>
          </div>
        </div>
        <h1 class="mt-5 font-medium">输入手机号验证码</h1>
        <p class="tips mt-2">
          请输入发送至 <strong>{{ LoginForm.value['mobilePhone'] }}</strong> 的6位验证码，有效期10分钟
        </p>
        <form-kit
          :config="configs"
          :row-gap="20"
          class="mt-6"
          v-model="LoginForm.value"
          size="large"
          :block="true"
        />
        <p class="tips mt-4">
          {{ LoginForm['countdown'] || 60 }}秒后可
          <a href="javascript:;" v-if="LoginForm.countdown === 60" @click="resetCountdown">重获验证码</a>
          <span href="javascript:;" v-else>重获验证码</span>
        </p>
        <p class="mt-2">
          <a href="javascript:;" class="font-light" @click="LoginForm.step = 3">密码登录</a>
        </p>
        <el-button
          color="#0D75FF"
          :loading="LoginForm.loading"
          @click="VerificationCodeLogin()"
          class="mt-45 w-full"
          size="large">
          下一步
        </el-button>
      </div>
      <!-- 密码输入 -->
      <div class="sign-in-context pt-13" v-if="LoginForm.step === 3">
        <div class="mb-1">
          <div class="inline-flex back-btn" @click="LoginForm.step = 2">
            <el-icon><ArrowLeft /></el-icon>
            <span class="ml-1">返回</span>
          </div>
        </div>
        <h1 class="mt-5 font-medium">输入密码</h1>
        <form-kit
          :config="configs"
          :row-gap="20"
          class="mt-6"
          v-model="LoginForm.value"
          size="large"
          :block="true"
        />
        <p class="mt-4">
          <a href="javascript:;" class="font-light" @click="LoginForm.step = 2">验证码登录</a>
        </p>
        <el-button
          color="#0D75FF"
          :loading="LoginForm.loading"
          @click="passwordLogin"
          class="mt-65 w-full"
          size="large">
          下一步
        </el-button>
      </div>
      <!-- 用户注册 -->
      <div class="sign-in-context pt-10" v-if="LoginForm.step === 4">
        <h1 class="font-medium">设置密码</h1>
        <p class="tips mt-2">
          密码仅可由数字、英文字母或英文符号组成，且需包含其中至少
          两种类型，长度不少于 8 个字符
        </p>
        <form-kit
          :config="configs"
          :row-gap="20"
          class="mt-6"
          v-model="LoginForm.value"
          size="large"
          :block="true"
        />
        <p class="tips mt-4">
          {{ LoginForm['countdown'] || 60 }}秒后可
          <a href="javascript:;" v-if="LoginForm.countdown === 60" @click="resetCountdown">重获验证码</a>
          <span href="javascript:;" v-else>重获验证码</span>
        </p>
        <el-button
          color="#0D75FF"
          :loading="LoginForm.loading"
          :disabled="canRegister"
          @click="register"
          class="mt-10 w-full"
          size="large">
          完 成
        </el-button>
      </div>
      <!-- 用户选择公司 -->
      <div class="sign-in-context pt-10" v-if="LoginForm.step === 5">
        <div class="mb-1">
          <div class="inline-flex back-btn" @click="LoginForm.step = 1">
            <el-icon><ArrowLeft /></el-icon>
            <span class="ml-1">重新登录</span>
          </div>
        </div>
        <h1 class="font-medium">你可以进入以下企业</h1>
        <p class="tips mt-2">
          <strong>{{ LoginForm.value['mobilePhone'] }}</strong> 已在以下企业或组织绑定了账号，你可进入以下任一企业或组织
        </p>
        <div class="mt-7 company-list">
          <div class="company-item" v-for="(it, idx) in LoginForm.company" :key="idx" @click="selectEnterprise(it.userid)">
            <v-avatar size="40px" :name="it['companyName'] || '律观个人用户'" :slice="1" border-radius="4px" bg-color="#1677FF" />
            <div class="flex-1 text-left">
              <span>{{ it['companyName'] || '律观个人用户' }}</span>
              <p class="tips">{{ it['nickname'] }}</p>
            </div>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.sign-in {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: url("/images/redirect/login-bg.png") center center no-repeat;
  background-size: cover;
  .sign-in-container {
    display: flex;
    border-radius: 18px;
    overflow: hidden;
    .banner {
      display: flex;
      align-items: center;
      width: 450px;
      min-height: 520px;
      .image-slot {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        color: var(--el-text-color-secondary);
        font-size: 30px;
      }
    }
    .sign-in-context {
      position: relative;
      width: 450px;
      background: #ffffff;
      padding-left: 50px;
      padding-right: 50px;
      padding-bottom: 55px;
      .h1 {
        font-size: 22px;
        font-weight: 400;
        color: #333333;
        line-height: 25px;
      }
      .sign-in-tab {
        display: flex;
        margin: 36px 0 20px;
        color: #333333;
        column-gap: 50px;
        li {
          cursor: pointer;
          user-select: none;
          padding: 10px 5px;
          transition: 200ms;
          &:hover { opacity: .76 }
        }
        .active {
          position: relative;
          color: #1677FF;
          &:after {
            content: "";
            display: inline-block;
            position: absolute;
            bottom: 0;
            left: calc(50% - 11px);
            width: 22px;
            height: 3px;
            background: #1677FF;
            border-radius: 148px 148px 148px 148px;
          }
        }
      }
      .protocol {
        font-weight: 400;
        color: #909399;
        line-height: 18px;
      }
      .back-btn {
        align-items: center;
        font-size: 14px;
        color: #999999;
        cursor: pointer;
        padding: 8px 10px;
        border-radius: 20px;
        margin-left: -12px;
        user-select: none;
        transition: 200ms;
        &:hover {
          background: #eeeeee;
        }
      }
      .sign-in-bottom {
        position: absolute;
        width: 100%;
        bottom: 15px;
        left: 0;
        font-size: 14px;
        color: #999999;
      }
      .tips {
        line-height: 20px;
        color: #999999;
        font-size: 15px;
        strong { color: #333333 }
      }
      .company-list {
        max-height: 370px;
        @include scrollbar;
        .company-item {
          padding: 12px;
          display: flex;
          align-items: center;
          column-gap: 8px;
          border: 1px solid #F2F3F5;
          border-radius: 4px;
          transition: 200ms;
          cursor: pointer;
          margin-bottom: 10px;
          &:last-child { margin-bottom: 0 }
          &:hover { border-color: #1677FF }
        }
      }
    }
  }
}
</style>

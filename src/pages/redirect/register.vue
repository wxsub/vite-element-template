<route>{ meta: { title: "注册企业", layout: "blank" } }</route>

<script setup lang="ts">
import { useUserStore } from "@/store/modules/user"
import { Picture as IconPicture, User, Lock, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const LoginForm: any = reactive({
  step: 2,
  countdown: 60,
  loading: false,
  value: { mobilePhone: 18917040945 },
  mobilePhoneConf: [
    {
      key: 'mobilePhone',
      type: 'input',
      props: { prefixIcon: User, placeholder: "请输入你的手机号码", class: 'w-full' }
    }
  ],
})

const configs = computed(() => {
  if (LoginForm.step === 1) return LoginForm.mobilePhoneConf
})

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

function FirstStep() {
  if (LoginForm.protocol) {
    sendMessage(Number(LoginForm.value.mobilePhone))
  } else ElMessage.warning('阅读服务协议以继续')
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
        <h1>完成企业注册，开启免费使用！</h1>
        <div>
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
          @click="FirstStep"
          size="large">
          下一步
        </el-button>
        <p class="text-center sign-in-bottom">
          还没有企业？<a href="">立即注册企业</a>
        </p>
      </div>
      <!-- 手机号输入 -->
      <div class="sign-in-context pt-23" v-if="LoginForm.step === 2">
        <h1>填写信息，开启使用！</h1>
        <p class="tips mt-2">
          我们将根据您的真实信息，为您提供更精准的定制化服务
        </p>
        <div>
          <form-kit
            :config="configs"
            :row-gap="20"
            class="mt-6"
            v-model="LoginForm.value"
            size="large"
            :block="true"
          />
        </div>
        <el-button
          color="#0D75FF"
          :loading="LoginForm.loading"
          class="mt-8 w-full"
          :disabled="!(/^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9])\d{8}$/.test(LoginForm.value.mobilePhone))"
          @click="FirstStep"
          size="large">
          下一步
        </el-button>
        <p class="text-center sign-in-bottom">
          已有账号，<a href="#">立即登录</a>
        </p>
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

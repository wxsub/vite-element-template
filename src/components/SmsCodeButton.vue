<template>
  <slot 
    :disabled="smsCodeDisabled" 
    :text="smsCodeText" 
    :send="sendSmsCode">
    <el-button 
      type="primary" 
      :disabled="smsCodeDisabled"
      @click="sendSmsCode">
      {{ smsCodeText }}
    </el-button>
  </slot>
</template>

<script lang="ts" setup>
type SmsCodeType = 0 | 1;
interface SmsCodeProps {
  phonenumber: string;
  /** 验证码类型 0-注册 1-登录 */
  type: SmsCodeType;
  /** 倒计时秒数，默认60秒 */
  countDown?: number;
}

const props = withDefaults(defineProps<SmsCodeProps>(), {
  countDown: 60
});

const PHONE_REGEXP = /^1[3-9]\d{9}$/,
  DEFAULT_BUTTON_TEXT = '获取验证码',
  COUNTDOWN_TEXT_TEMPLATE = (seconds: number) => `${seconds}秒后重新获取`;

const smsCodeDisabled = ref(false),
  smsCodeText = ref(DEFAULT_BUTTON_TEXT),
  countdownTimer = ref<number | null>(null);

const isPhoneValid = computed(() => {
  return PHONE_REGEXP.test(props.phonenumber.trim());
})

watch(
  () => props.phonenumber,
  () => {
    if (smsCodeDisabled.value && isPhoneValid.value) {
      resetCountdown();
    }
  },
  { immediate: false, deep: false }
)

async function sendSmsCode() {
  if (!props.phonenumber) {
    ElMessage.warning('请先输入手机号');
    return;
  }

  if (!isPhoneValid.value) {
    ElMessage.warning('请输入正确的手机号格式');
    return;
  }

  if (smsCodeDisabled.value) return;

  try {
    smsCodeDisabled.value = true;
    
    await useAxios().post('/supplier-api/sys/sendSmsCode', {
      phonenumber: props.phonenumber.trim(),
      codeType: props.type
    });

    ElMessage.success('验证码发送成功，请注意查收');
    startCountdown();
  } catch (error: unknown) {
    smsCodeDisabled.value = false;
    
    if (error instanceof Error) {
      ElMessage.error(`验证码发送失败：${error.message}`);
      console.error('发送验证码失败:', error);
    } else {
      ElMessage.error('验证码发送失败，请稍后重试');
      console.error('发送验证码失败:', error);
    }
  }
}

function startCountdown() {
  if (countdownTimer.value) {
    window.clearInterval(countdownTimer.value);
  }

  let remainingSeconds = props.countDown;
  smsCodeText.value = COUNTDOWN_TEXT_TEMPLATE(remainingSeconds);

  countdownTimer.value = window.setInterval(() => {
    remainingSeconds--;
    
    if (remainingSeconds <= 0) {
      resetCountdown();
      return;
    }
    
    smsCodeText.value = COUNTDOWN_TEXT_TEMPLATE(remainingSeconds);
  }, 1000)
}

function resetCountdown() {
  if (countdownTimer.value) {
    window.clearInterval(countdownTimer.value)
    countdownTimer.value = null
  }
  
  smsCodeDisabled.value = false
  smsCodeText.value = DEFAULT_BUTTON_TEXT
}

onUnmounted(() => resetCountdown())

defineExpose({
  sendSmsCode,
  resetCountdown
})
</script>

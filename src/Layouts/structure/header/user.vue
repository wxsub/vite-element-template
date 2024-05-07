<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import addUser from '@/components/system/addUser.vue'
import AvatarStyleModule from "@/assets/styles/modules/layouts/avatar.module.scss"
import { useUserStoreHook } from "@/store/modules/user"
import { useRouter } from "vue-router"
const menus = computed(() => {
  return [
    { title: '设置', active: () => linkTo('/setting/account') },
    { title: '我的二维码与链接', active: () => openAdduser() },
    { title: '管理后台' },
    { title: '帮助与客服' },
    { title: '退出登录', active: () => userStore.logout() }
  ]
}), asyncComponent: any = reactive({ component: null, bind: {} });

const userStore = useUserStoreHook(),
  router = useRouter(), user: any = computed(() => {
    return userStore.user.data || {}
  }), nickname = computed(() => {
    if (user.value.nickname) return user.value.nickname.substring(user.value.nickname.length - 2)
    return "佚名"
  });

const errorHandler = () => true

function linkTo(path: string) {
  if (path) router.push(path)
}

function openAdduser() {
  asyncComponent.component = addUser
  asyncComponent.bind = { modelValue: true }
}
</script>

<template>
  <div class="inline-flex flex-items-center">
    <el-popover :width="300" placement="right" trigger="hover" popper-style="padding: 0">
      <template #reference>
        <div :class="AvatarStyleModule.avatar" class="w-12 h-12">
          <el-avatar
            @error="errorHandler"
            class="w-full h-full"
            :src="user['picture']">
            <div :class="AvatarStyleModule.error">{{ nickname }}</div>
          </el-avatar>
        </div>
      </template>
      <template #default>
        <div :class="AvatarStyleModule.avatarPopover">
          <div :class="AvatarStyleModule.banner">
            <div :class="AvatarStyleModule.avatar" class="w-15 h-15">
              <el-avatar
                @error="errorHandler"
                class="w-full h-full"
                :src="user['picture']">
                <div :class="AvatarStyleModule.error">{{ nickname }}</div>
              </el-avatar>
            </div>
            <div :class="AvatarStyleModule.bannerText">
              <h6>{{ user['nickname'] || '佚名' }}</h6>
              <p v-if="user['companyName']">
                <img src="/images/layout/company-icon.png" alt="律观科技">
                <span class="ml-1">{{ user['companyName'] }}</span>
              </p>
            </div>
          </div>
          <ul :class="AvatarStyleModule.list">
            <li v-for="(it, idx) in menus" :key="idx" @click="it.active ? it.active() : null">
              <div>{{ it.title }}</div>
              <el-icon><ArrowRight /></el-icon>
            </li>
          </ul>
        </div>
      </template>
    </el-popover>
  </div>
  <component :is="asyncComponent.component" v-bind="asyncComponent.bind" />
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/modules/user"
import VAvatar from "@/components/business/vAvatar.vue"

const popoverStyle: any = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  maxHeight: '42vh',
  columnGap: '6px',
  'overflow-y': 'auto'
}, company = computed(() => useUserStore().user.companyList || []),
  userId = computed(() => useUserStore().user.data.userid || null);
</script>

<template>
  <ul :class="$style.company">
    <li v-if="company.length > 6">
      <el-popover
        placement="right"
        :width="200"
        trigger="hover">
        <template #reference>
          <el-image class="w-full h-full b-rd-1" src="/images/layout/more.png" />
        </template>
        <template #default>
          <div :style="popoverStyle">
            <div v-for="(it, idx) in 18" :key="idx" class="w-full h-full text-center py-2 companyPopoverItem">
              <v-avatar name="翠花" :slice="2" font-size="12px" />
            </div>
          </div>
        </template>
      </el-popover>
    </li>
    <li
      v-for="(it, idx) in company"
      :key="idx"
      :title="it['companyName'] || '律观个人用户'"
      :class="{ [$style.active]: userId === it['userid'] }"
      @click="userId === it['userid'] ? null : useUserStore().changeRoles(it['userid'])">
      <v-avatar
        size="32px"
        :name="it['companyName'] || '律观个人用户'"
        :slice="1"
        border-radius="4px"
        bg-color="#1677FF" />
    </li>
  </ul>
</template>

<style module lang="scss">
.company {
  text-align: center;
  li {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 4px 4px 4px 4px;
    border: 2px solid transparent;
    cursor: pointer;
    padding: 2px;
    box-sizing: border-box;
    @extend .hover;
    margin: 10px auto 0;
  }
  .active {
    border-color: #0171FF;
  }
}
</style>
<style>
.companyPopoverItem {
  cursor: pointer;
  transition: 200ms;
  border-radius: 6px;
  &:hover {
    background: #eeeeee;
  }
}
</style>

<script setup lang="ts">
import FormKit from "@/components/FormKit/index.vue"
import { Search } from '@element-plus/icons-vue'
import VAvatar from "@/components/business/vAvatar.vue"
import Items from "@/components/business/contact/items.vue"
import contact from "@/assets/styles/modules/contact.module.scss"
import http from "@/config/axios.config"
import UserCard from "@/components/system/usercard.vue"

const created: any = reactive({ visible: false, keywords: '', loading: false, list: [] }),
  addDialog: any = reactive({
    visible: false,
    loading: false,
    from: {},
    temporary: {},
    configs: [
      {
        key: 'remark',
        label: '备注',
        type: 'input',
        props: { placeholder: "请输入申请理由", class: 'w-full' }
      },
      {
        key: 'message',
        label: '申请理由',
        type: 'input',
        props: { type: "textarea", placeholder: "请输入申请理由", class: 'w-full' }
      }
    ]
  }),
  pages: any = reactive({ loading: false, remote: [] });

onActivated(() => GetList())
async function searchActive() {
  try {
    created.loading = true
    const mobilePhone = created.keywords,
      response = await http.post(`addressBook/searchUser`, { mobilePhone: Number(mobilePhone) });
    created.loading = false
    if (Array.isArray(response?.data)) {
      created.list = response.data
    } else created.list = []
  } catch (e) {
    created.loading = false
  }
}
async function GetList () {
  try {
    pages.loading = true
    const response = await http.post(`addressBook/getUserList`);
    pages.loading = false
    pages.remote = response.data || []
  } catch (e) {
    pages.loading = false
  }
}

async function add() {
  try {
    const { message, remark } = addDialog.from, { userid } = addDialog.temporary || {};
    if (userid) {
      addDialog.loading = true
      const response: any = await http.post(`addressBook/addFriend`, {
        userid, message, note: remark
      })
      addDialog.loading = false
      if (response?.code === 200) {
        await searchActive()
        addDialog.visible = false
        ElMessage.success("添加成功")
      }
    }
  } catch (e) {
    addDialog.visible = false
    addDialog.loading = false
    console.log(e)
  }
}
</script>

<template>
  <div>
    <div :class="contact.header">
      <span>外部联系人</span>
      <el-button color="#3370ff" plain @click="created.visible = true">
        <span>
          <!-- <img src="/images/pages/contact/add-people.png" class="w-4 h-4 align-bottom" alt="律观科技" />-->
          <span>添加外部联系人</span>
        </span>
      </el-button>
    </div>
    <div :class="contact.main">
      <el-skeleton :rows="3" animated class="mt-5" v-if="pages.loading" />
      <el-empty description="外部联系人空空如也~" v-else-if="pages.remote.length === 0">
        <el-link type="primary" :underline="false" @click="GetList">重新获取</el-link>
      </el-empty>
      <template v-else>
        <user-card
          class="mt-2"
          v-for="(it, idx) in pages.remote"
          :key="idx"
          :name="it.nickname"
          :userid="it['sideUserid']"
          @updated="GetList"
          placement="bottom-start"
          :offset="0">
          <Items
            size="44px"
            font-size="14px"
            class="cursor-pointer"
            :name="it.note || it.info['nickname']"
            :src="it.info['picture']"/>
        </user-card>
      </template>
    </div>
  </div>

  <el-dialog v-model="created.visible" title="添加外部联系人" width="520px" center>
    <div>
      <el-input
        v-model="created.keywords"
        :disabled="created.loading"
        autofocus
        placeholder="搜索手机号或邮箱，按Enter键确认"
        size="large"
        @keydown.enter="searchActive">
        <template #prefix>
          <el-icon class="el-input__icon"><search /></el-icon>
        </template>
        <template #suffix v-if="false">
          <el-button
            color="#3370ff"
            :loading="created.loading"
            size="small"
            v-if="created.keywords"
            @click.stop="searchActive">
            查询
          </el-button>
        </template>
      </el-input>
      <ul :class="contact.searchContainer">
        <el-skeleton :rows="3" animated class="mt-2" v-if="created.loading" />
        <el-empty description="输入手机号以查询" v-else-if="created.list.length === 0" />
        <li v-for="(it, idx) in created.list" :key="idx" v-else>
          <v-avatar
            size="32px"
            :slice="1"
            :name="it['nickname'] || '佚名'"
            :src="it.picture"/>
          <div class="flex-1 ml-1">
            <h4>{{ it['nickname'] || "佚名" }}</h4>
            <p>{{ it['companyName'] }}</p>
          </div>
          <el-button
            color="#3370ff"
            size="small"
            :disabled="it['status'] === 0 || it['status'] === 1"
            @click="addDialog.visible = true; addDialog.temporary = it">
            <span v-if="it['status'] === 0">已申请</span>
            <span v-else-if="it['status'] === 1">已添加</span>
            <span v-else>添加</span>
          </el-button>
        </li>
      </ul>
    </div>
  </el-dialog>

  <el-dialog v-model="addDialog.visible" title="即将完成添加" width="420px" center>
    <div>
      <form-kit
        :config="addDialog.configs"
        :row-gap="20"
        v-model="addDialog.from"
        size="large"
        :block="true"
      />
    </div>
    <template #footer>
      <span>
        <el-button @click="addDialog.visible = false; addDialog.from = {}">取消</el-button>
        <el-button type="primary" @click="add()" :loading="addDialog.loading">
          立即添加
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import Items from "@/components/business/contact/items.vue"
import contact from "@/assets/styles/modules/contact.module.scss"
import http from "@/config/axios.config"

const pages: any = reactive({ loading: false, remote: [] });

onActivated(() => GetList())
async function GetList () {
  try {
    pages.loading = true
    const response = await http.post(`addressBook/newContactsList`)
    pages.loading = false
    if (Array.isArray(response?.data)) pages.remote = response.data
  } catch (e) {
    pages.loading = false
  }
}

/**
 *
 * @param type 操作类型(0 拒绝，1 同意)
 * @param row 列表数据
 */
async function operation(type: number, row: any) {
  try {
    if (row?.id) {
      let reason: any = null
      if (type === 1) {
        reason = await ElMessageBox.prompt('请输入备注', '即将完成同意操作', {
          confirmButtonText: '立即同意',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入备注',
          // inputPattern: /\S/,
          inputErrorMessage: '备注不可为空'
        })
      } else {
        await ElMessageBox.confirm(
          '确认拒绝此操作吗?',
          '拒绝',
          {
            confirmButtonText: '拒绝',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
      }
      row[`loading-${type}`] = true
      const rxd: any = { type, id: row.id }
      if (reason && reason.value) rxd.note = reason.value
      const response: any = await http.post(`addressBook/operationRequest`, rxd)
      if (response?.code === 200) await GetList()
      row[`loading-${type}`] = false
    }
  } catch (e: any) {
    row[`loading-${type}`] = false
  }
}
</script>

<template>
  <div>
    <div :class="contact.header">
      <span>新的联系人</span>
    </div>
    <div :class="contact.main">
      <el-skeleton :rows="3" animated class="mt-5" v-if="pages.loading" />
      <el-empty description="新的联系人空空如也~" v-else-if="pages.remote.length === 0">
        <el-link type="primary" :underline="false" @click="GetList">重新获取</el-link>
      </el-empty>
      <Items
        :name="it.info['nickname'] || '佚名'"
        class="mt-2"
        v-else
        :src="it.info['picture']"
        v-for="(it, idx) in pages.remote"
        :key="idx">
        <template #description v-if="it.message">
          <p :class="contact.itemDescription">申请信息：{{ it.message }}</p>
        </template>
        <template #append>
          <span v-if="it['status'] === -1" class="color-coolgray">已过期</span>
          <span v-else-if="it['status'] === 1" class="color-coolgray">已通过</span>
          <span v-else-if="it['status'] === 2" class="color-coolgray">已拒绝</span>
          <template v-else>
            <el-button
              color="#3370ff"
              :loading="it[`loading-1`]"
              @click="operation(1, it)"
              size="small">
              同意
            </el-button>
            <el-button
              size="small"
              :loading="it[`loading-0`]"
              @click="operation(0, it)">
              拒绝
            </el-button>
          </template>
        </template>
      </Items>
    </div>
  </div>
</template>

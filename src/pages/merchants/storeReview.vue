<route>
  { meta: { title: "店铺信息审核" } }
</route>

<script setup lang="ts">
type reviewDailogType = {
  visible: boolean,
  value: any,
  loading?: boolean
  id: number | null
  total?: number
  page?: number
}

const Query = ref<any>({ page: 1, limit: 10 }),
  total = ref(0),
  loading = ref(false),
  reviewDailog = reactive<reviewDailogType>({ visible: false, value: [], id: null }),
  items: any = ref([]);

onMounted(() => GetList())

const GetList = async () => {
  try {
    loading.value = true
    const response: any = await useAxios().get('/wallet/manager-salary/list', { params: Query.value })
    loading.value = false
    items.value = response?.items || []
    total.value = response?.total || 0
  } catch (e) {
    loading.value = false
  }
}

const opener = (id: number) => {
  if (id) {
    reviewDailog.id = id
    reviewDailog.visible = true
  }
}
</script>

<template>
  <div class="flex align-center gap-[16px]">
    <div class="flex align-center">
      <FormKit
        :config="[
          {
            type: 'input',
            key: 'shopName',
            props: { placeholder: '请输入店铺名称' }
          },
          {
            type: 'select',
            key: 'auditState',
            props: { placeholder: '请选择查询的状态', style: { width: '160px' }, clearable: true },
            options: [
              { name: '待审核', id: 'PENDING_APPROVAL' },
              { name: '审核通过', id: 'APPROVED' },
              { name: '审核拒绝', id: 'REJECTED' }
            ]
          }
        ]"
        columns="auto"
        v-model="Query">
        <template #append>
          <el-col :span="null">
            <el-button type="warning" @click="GetList()">搜索</el-button>
          </el-col>
        </template>
      </FormKit>
    </div>
  </div>

  <div class="mt-4 min-h-[320px]" v-loading="loading">
    <el-table :data="items" stripe>
      <el-table-column prop="id" label="ID" align="center" width="60" />
      <el-table-column prop="agentName" label="姓名" align="center" />
      <el-table-column prop="accountNo" label="账号" align="center" />
      <el-table-column prop="salary" label="薪资" align="center" />
      <el-table-column prop="available" label="可用薪资" align="center" />
      <el-table-column prop="frozen" label="冻结薪资" align="center" />
      <el-table-column prop="salaryTypeName" label="提成类型" align="center" />
      <el-table-column label="状态" align="center">
        <template #default="{ row }">
          <el-tag type="primary" v-if="row.status === 'CONFIRMED'">待确认</el-tag>
          <el-tag type="success" v-else-if="row.status === 'PAID'">已发放</el-tag>
          <el-tag type="warning" v-else-if="row.status === 'DRAFT'">未发放</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="薪资月份" align="center" />
      <el-table-column label="操作" align="center" width="120">
        <template #default="{ row }">
          <el-button type="primary" link @click="opener(row.id)">查看明细</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex justify-end mt-4" v-if="total >= Query.limit">
      <el-pagination background v-model:current-page="Query.page" layout="prev, pager, next" @change="GetList()"
        :total="total" :page-size="Query.limit" />
    </div>

    <el-dialog v-model="reviewDailog.visible" title="审核" :close-on-click-modal="false" width="600">
      <div>
        111
      </div>
    </el-dialog>
  </div>
</template>
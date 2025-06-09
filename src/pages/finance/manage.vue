<route>
    { meta: { title: "财务管理" } }
</route>

<script setup lang="ts">
type detailDailogType = {
  visible: boolean,
  items: any,
  loading?: boolean
  id: number | null
  total?: number
  page?: number
}

const Query = ref({ name: null, page: 1, limit: 10 }),
  total = ref(0),
  loading = ref(false),
  detailDailog = reactive<detailDailogType>({ visible: false, items: [], id: null }),
  items:any = ref([]);

onMounted(() => GetList())

const GetList = async () => {
  try {
    loading.value = true
    const response: any = await useAxios().get('/wallet/manager-salary/salary-list', { params: Query.value })
    loading.value = false
    items.value = response?.items || []
    total.value = response?.total || 0
  } catch (e) {
    loading.value = false
  }
}

const opener = (id: number) => {
    if (id) {
      detailDailog.id = id
      detailDailog.visible = true
      fetchDetail()
    }
}
const fetchDetail = async () => {
  try {
    const { id, page } = detailDailog
    detailDailog.loading = true
    const { items, total }: any = await useAxios().get('/wallet/manager-salary/info', { params: { page, salaryId: id } })
    detailDailog.loading = false
    detailDailog.items = items || {}
    detailDailog.total = total || 0
  } catch (e) {
    detailDailog.loading = false
  }
}
</script>

<template>
  <div class="flex align-center gap-[16px]">
    <div class="w-[320px] flex align-center">
      <el-input v-model="Query.name" placeholder="请输入商务名称" />
      <el-button type="warning" class="ml-4" @click="GetList()">
        搜索
      </el-button>
    </div>
  </div>

  <div class="mt-4 min-h-[320px]" v-loading="loading">
    <el-table :data="items" stripe>
      <el-table-column prop="agentName" label="姓名" align="center" />
      <el-table-column prop="accountNo" label="账号" align="center" />
      <el-table-column prop="gdgz" label="固定工资" align="center" />
      <el-table-column prop="jxbt" label="绩效补贴" align="center" />
      <el-table-column prop="grtc" label="个人提成" align="center" />
      <el-table-column prop="fdtc" label="辅导提成" align="center" />
      <el-table-column prop="tdtc" label="团队提成" align="center" />
      <el-table-column prop="tjtc" label="推荐提成" align="center" />
      <el-table-column label="状态" align="center">
        <template #default="{ row }">
          <el-tag type="primary" v-if="row.status === 'CONFIRMED'">待确认</el-tag>
          <el-tag type="success" v-else-if="row.status === 'PAID'">已发放</el-tag>
          <el-tag type="warning" v-else-if="row.status === 'DRAFT'">未发放</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="薪资月份" align="center" />
      <!-- <el-table-column label="操作" align="center" width="120">
        <template #default="{ row }">
          <el-button type="primary" link @click="opener(row.id)">查看明细</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <div class="flex justify-end mt-4" v-if="total >= Query.limit">
      <el-pagination
        background
        v-model:current-page="Query.page"
        layout="prev, pager, next"
        @change="GetList()"
        :total="total"
        :page-size="Query.limit" />
    </div>

    <el-dialog
        v-model="detailDailog.visible"
        title="薪资明细"
        :close-on-click-modal="false"
        width="600">
        <div>
            <el-table height="400" :data="detailDailog.items" stripe :loading="detailDailog.loading">
                <el-table-column prop="id" label="ID" align="center" width="60" />
                <el-table-column label="金额" align="center">
                    <template #default="{ row }">
                        <span v-if="row.amount">
                            <span>{{ row.side === 'IN' ? "+" : "-" }}</span>
                            <span>{{ row.amount }}</span>
                        </span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="时间" align="center" />
                <el-table-column label="备注" align="center">
                    <template #default="{ row }">
                        <span>{{ row.remark || '-' }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4" v-if="total >= Query.limit">
                <el-pagination
                  background
                  v-model:current-page="detailDailog.page"
                  layout="prev, pager, next"
                  @change="fetchDetail()"
                  :total="detailDailog.total"
                  :page-size="15" />
            </div>
        </div>
    </el-dialog>
  </div>
</template>
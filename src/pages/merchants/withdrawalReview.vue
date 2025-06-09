<route>
    { meta: { title: "提现信息审核" } }
  </route>
  
  <script setup lang="ts">
  import FormKit from "@/components/FormKit/index.vue"
  type FormKitInstance = InstanceType<typeof FormKit>
  
  type reviewDailogType = {
    visible: boolean,
    value: any,
    loading?: boolean
    id: number | null
  }
  
  const Query = ref<any>({ page: 1, limit: 10 }),
    total = ref(0),
    loading = ref(false),
    reviewFormRef = ref<FormKitInstance>(),
    reviewDailog = reactive<reviewDailogType>({ visible: false, value: {}, id: null }),
    items: any = ref([]);
  
  onMounted(() => GetList())
  
  const GetList = async () => {
    try {
      loading.value = true
      const response: any = await useAxios().get('/wallet/subsidy/withdrawals', { params: Query.value })
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
      reviewFormRef.value?.clearValidate()
    }
  }
  
  const review = async () => {
    const { id } = reviewDailog
    try {
      await reviewFormRef.value?.validate(true)
      reviewDailog.loading = true
      const response: any = await useAxios().put(`/wallet/subsidy/withdrawal-audit/${id}`, reviewDailog.value)
      reviewDailog.loading = false
      reviewDailog.visible = false
      GetList()
      ElMessage.success(response?.message || '操作成功')
    } catch (e) {
      reviewDailog.loading = false
    }
  }
  </script>
  
  <template>
    <div>
      <FormKit
        :config="[
          {
            type: 'select',
            key: 'state',
            props: { placeholder: '请选择查询的状态', style: { width: '160px' }, clearable: true },
            options: [
              { name: '待审核', id: 'PENDING_APPROVAL' },
              { name: '审核通过', id: 'APPROVED' },
              { name: '审核拒绝', id: 'REJECTED' },
              { name: '已完成', id: 'COMPLETED' }
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
  
    <div class="mt-4 min-h-[320px]" v-loading="loading">
      <el-table :data="items" stripe>
        <el-table-column prop="id" label="id" align="center" width="70" />
        <el-table-column prop="accountId" label="账户ID" align="center" />
        <el-table-column prop="amount" label="提现金额" align="center" />
        <el-table-column label="状态" align="center">
          <template #default="{ row }">
            <el-tag type="primary" v-if="row.state === 'PENDING_APPROVAL'">待审核</el-tag>
            <el-tag type="success" v-else-if="row.state === 'APPROVED'">审核通过</el-tag>
            <el-tag type="warning" v-else-if="row.state === 'REJECTED'">审核拒绝</el-tag>
            <el-tag type="success" v-else-if="row.state === 'COMPLETED'">已完成</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" show-overflow-tooltip width="120">
            <template #default="{ row }">
                <span>{{ row.memo || '-' }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="recordedTime" label="记录时间" align="center" show-overflow-tooltip width="140" />
        <el-table-column label="操作" align="center" width="80" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="opener(row.id)" :disabled="row.state !== 'PENDING_APPROVAL'">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <div class="flex justify-end mt-4" v-if="total >= Query.limit">
        <el-pagination background v-model:current-page="Query.page" layout="prev, pager, next" @change="GetList()"
          :total="total" :page-size="Query.limit" />
      </div>
  
      <el-dialog v-model="reviewDailog.visible" title="提现信息审核" :close-on-click-modal="false" width="420">
        <FormKit
          :config="[
            {
              type: 'radio',
              key: 'state',
              rules: [
                { required: true, message: '请选择审核结果' }
              ],
              options: [
                { name: '同意', id: 'APPROVED' },
                { name: '拒绝', id: 'REJECTED' }
              ]
            },
            {
              type: 'input',
              label: '审核意见',
              key: 'memo',
              props: { placeholder: '请输入审核意见', type: 'textarea' }
            }
          ]"
          v-model="reviewDailog.value"
          ref="reviewFormRef" />
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="reviewDailog.visible = false">关闭</el-button>
            <el-button type="primary" @click="review" :loading="reviewDailog.loading">提交</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </template>
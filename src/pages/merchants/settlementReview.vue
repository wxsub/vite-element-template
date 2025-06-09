<route>
    { meta: { title: "结算卡审核" } }
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
      const response: any = await useAxios().get('/default/shop-edit/bank-card-info', { params: Query.value })
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
      const submit = { ...reviewDailog.value, id }
      const response: any = await useAxios().put('/default/shop-edit/audit-bank-card-info', submit)
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
  
    <div class="mt-4 min-h-[320px]" v-loading="loading">
      <el-table :data="items" stripe>
        <el-table-column prop="id" label="id" align="center" width="70" />
        <el-table-column label="银行名称" align="center">
          <template #default="{ row }">
            <span>{{ row.bankCode || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="{ row }">
            <el-tag type="primary" v-if="row.bankCardType === 'PERSONAL'">对私账户</el-tag>
            <el-tag type="success" v-else-if="row.bankCardType === 'CORPORATE'">对公账户</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="支行名称" align="center" show-overflow-tooltip width="120">
          <template #default="{ row }">
            <span>{{ row.bankName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="openBankProvinceCity" label="开户省市" align="center" width="120" />
        <el-table-column prop="openUserName" label="开户人姓名" align="center" width="130" />
        <el-table-column prop="bankCardNo" label="银行账号" align="center" width="130" />
        <el-table-column prop="openUserIdCardNo" label="开户人身份号" align="center" width="130" />
        <el-table-column label="银行卡正面照" align="center" width="110">
          <template #default="{ row }">
            <el-image
              :src="row.frontBankCardImage"
              :zoom-rate="1.2"
              class="w-[70px] h-[70px] rounded-lg"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[row.frontBankCardImage]"
              preview-teleported
              show-progress
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="银行卡反面照" align="center" width="110">
          <template #default="{ row }">
            <el-image
              :src="row.backBankCardImage"
              :zoom-rate="1.2"
              class="w-[70px] h-[70px] rounded-lg"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[row.backBankCardImage]"
              preview-teleported
              show-progress
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="开户正面" align="center" width="110">
          <template #default="{ row }">
            <el-image
              :src="row.proveImage"
              :zoom-rate="1.2"
              class="w-[70px] h-[70px] rounded-lg"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[row.proveImage]"
              preview-teleported
              show-progress
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="{ row }">
            <el-tag type="primary" v-if="row.auditState === 'PENDING_APPROVAL'">待审核</el-tag>
            <el-tag type="success" v-else-if="row.auditState === 'APPROVED'">审核通过</el-tag>
            <el-tag type="warning" v-else-if="row.auditState === 'REJECTED'">审核拒绝</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdTime" label="时间" align="center" width="120" />
        <el-table-column prop="memo" label="备注" align="center" show-overflow-tooltip width="120" />
        <el-table-column label="操作" align="center" width="80" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="opener(row.id)" :disabled="row.auditState !== 'PENDING_APPROVAL'">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <div class="flex justify-end mt-4" v-if="total >= Query.limit">
        <el-pagination background v-model:current-page="Query.page" layout="prev, pager, next" @change="GetList()"
          :total="total" :page-size="Query.limit" />
      </div>
  
      <el-dialog v-model="reviewDailog.visible" title="审核" :close-on-click-modal="false" width="420">
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
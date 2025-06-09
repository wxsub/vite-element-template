<route>
  { meta: { title: "商户管理" } }
</route>
  
<script setup lang="ts">
  import FormKit from "@/components/FormKit/index.vue"
  type FormKitInstance = InstanceType<typeof FormKit>
  type merchantReviewType = {
    visible: boolean;
    loading: any;
    value: {
      isRegister?: boolean,
      memo?: string,
      id?: [string, number]
      isSign?: boolean,
      isReport?: boolean,
      isWechatOpen?: boolean
      openPayment?: boolean,
      isWechatSuccess?: boolean
    };
  }

  const filterQuery = ref({
      page: 1,
      limit: 10
    }),
    total = ref(0),
    reviewFormRef = ref<FormKitInstance>(),
    loading = ref(false),
    items:any = ref([]),
    merchantReview = reactive<merchantReviewType>({ // 商户审核数据集
      visible: false,
      loading: {},
      value: {}
    }),
    merchant = reactive<{ visible: boolean; value: any; target: string; loading: boolean }>({
      visible: false,
      value: { addressCodes: [] },
      target: 'StoreInfo',
      loading: false
    });
  
  const StoreInfoFormConfigs = computed(() => {
    return [
      {
        label: '店铺类别',
        type: 'cascader',
        key: 'categoryId',
        request: useAxios().get('/default/shop/category-tree'),
        handle: (response: any) => Array.isArray(response) ? response : [],
        props: {
          style: { width: '100%' },
          placeholder: '请选择店铺类别',
          props: {
            label: 'name',
            value: 'id',
            children: 'children'
          }
        }
      },
      {
        type: 'input',
        label: '店铺编码',
        key: 'code',
        props: { placeholder: '请输入店铺编码', max: 10 },
        rules: [
          { required: true, message: '店铺编码不能为空' }
        ]
      },
      {
        type: 'input',
        label: '店铺名称',
        key: 'name',
        props: { placeholder: '请输入店铺名称' },
        rules: [
          { required: true, message: '店铺名称不能为空' }
        ]
      },
      {
        type: 'input',
        label: '店铺联系电话',
        key: 'shopPhoneNo',
        props: { placeholder: '请输入店铺联系电话' }
      },
      {
        label: '营业时间',
        type: 'select',
        key: 'businessState',
        options: [
          { name: '全天营业', id: 'ALL' },
          { name: '时间段营业', id: 'TIME' },
          { name: '暂不营业', id: 'CLOSED' }
        ]
      },
      {
        label: '营业开始时间',
        type: 'timePicker',
        key: 'businessStartTime',
        visible: { key: 'businessState', value: 'TIME' },
        props: {
          style: { width: '100%' },
          valueFormat: 'HH:mm',
          placeholder: '营业开始时间'
        }
      },
      {
        label: '营业结束时间',
        type: 'timePicker',
        key: 'businessEndTime',
        visible: { key: 'businessState', value: 'TIME' },
        props: {
          style: { width: '100%' },
          valueFormat: 'HH:mm',
          placeholder: '营业结束时间'
        }
      },
      {
        type: 'address',
        label: '店铺区域地址',
        key: 'addressCodes',
        props: { level: 3, placeholder: '请选择店铺区域地址' },
        rules: [
          { required: true, message: '店铺区域地址不能为空' }
        ]
      },
      {
        type: 'input',
        label: '店铺详情地址',
        key: 'address',
        span: 24,
        props: { placeholder: '请输入店铺详情地址', type: 'textarea' }
      },
      {
        type: 'inputNumber',
        label: '积分让利比例',
        key: 'pointRatio',
        props: {
          controlsPosition: 'right',
          style: { width: '100%' },
          suffix: '%',
          placeholder: '请输入积分让利比例'
        }
      },
      {
        type: 'upload',
        label: '店铺封面图',
        key: 'coverImage',
        span: 24,
        props: { limit: 1 }
      },
      {
        type: 'upload',
        label: '店铺收银台图片',
        key: 'cashierImage',
        span: 24,
        props: { limit: 1 }
      },
      {
        type: 'upload',
        label: '店铺室内图',
        key: 'roomImages',
        span: 24,
        props: { limit: 6 }
      }
    ]
  })
  const CompanyEntityFormConfigs = computed(() => {
    return [
      {
        type: 'upload',
        label: '营业执照图片',
        key: 'businessLicenceImage',
        props: { limit: 1 },
        rules: [
          { required: true, message: '营业执照图片不能为空' }
        ]
      },
      {
        label: '营业执照类型',
        type: 'radio',
        key: 'businessLicenceType',
        options: [
          { name: '个体工商户', id: 'INDIVIDUAL' },
          { name: '企业', id: 'CORPORATE' }
        ]
      },
      {
        type: 'input',
        label: '公司统一社会信用代码',
        key: 'companyCode',
        props: { placeholder: '请输入公司统一社会信用代码' },
        rules: [
          { required: true, message: '公司统一社会信用代码不能为空' }
        ]
      },
      {
        type: 'input',
        label: '公司名称',
        key: 'companyName',
        props: { placeholder: '请输入公司名称' },
        rules: [
          { required: true, message: '公司名称不能为空' }
        ]
      },
      {
        type: 'input',
        label: '公司注册地址',
        key: 'registeredAddress',
        props: { placeholder: '请输入公司注册地址' }
      },
      {
        label: '永久有效期',
        type: 'radio',
        key: 'isPermanentCompany',
        options: [
          { name: '是', id: true },
          { name: '否', id: false }
        ]
      },
      {
        type: 'datePicker',
        label: '公司营业执照有效期开始时间',
        key: 'companyStartPeriodDate',
        visible: { key: 'isPermanentCompany', value: false },
        props: {
          style: { width: '100%' },
          valueFormat: 'YYYYMMDD',
          placeholder: '请选择公司营业执照有效期开始时间'
        },
        rules: [
          { required: true, message: '公司营业执照有效期开始时间不能为空' }
        ]
      },
      {
        type: 'datePicker',
        label: '公司营业执照有效期结束时间',
        key: 'companyEndPeriodDate',
        visible: { key: 'isPermanentCompany', value: false },
        props: {
          style: { width: '100%' },
          valueFormat: 'YYYYMMDD',
          placeholder: '请选择公司营业执照有效期结束时间'
        },
        rules: [
          { required: true, message: '公司营业执照有效期结束时间不能为空' }
        ]
      }
    ]
  })
  const LegalPersonInfoFormConfigs = computed(() => {
    return [
      {
        type: 'input',
        label: '法人姓名',
        key: 'legalName',
        props: { placeholder: '请输入法人姓名' },
        rules: [
          { required: true, message: '法人姓名不能为空' }
        ]
      },
      {
        type: 'input',
        label: '法人手机号',
        key: 'legalPhoneNo',
        props: { placeholder: '请输入法人手机号' }
      },
      {
        type: 'input',
        label: '法人身份证号',
        key: 'legalIdCardNo',
        props: { placeholder: '请输入法人身份证号' },
        rules: [
          { required: true, message: '法人身份证号不能为空' }
        ]
      },
      {
        type: 'input',
        label: '法人身份证地址',
        key: 'idCardAddress',
        props: { placeholder: '请输入法人身份证地址' }
      },
      {
        label: '永久有效',
        type: 'radio',
        key: 'isPermanentIdCard',
        span: 24,
        rules: [
          { required: true, message: '永久有效不能为空' }
        ],
        options: [
          { name: '是', id: true },
          { name: '否', id: false }
        ]
      },
      {
        type: 'datePicker',
        label: '身份证有效期开始日期',
        key: 'idCardStartPeriodDate',
        visible: { key: 'isPermanentIdCard', value: false },
        props: {
          style: { width: '100%' },
          valueFormat: 'YYYYMMDD',
          placeholder: '请选择身份证有效期开始日期'
        },
        rules: [
          { required: true, message: '身份证有效期开始日期不能为空' }
        ]
      },
      {
        type: 'datePicker',
        label: '身份证有效期结束日期',
        key: 'idCardEndPeriodDate',
        visible: { key: 'isPermanentIdCard', value: false },
        props: {
          style: { width: '100%' },
          valueFormat: 'YYYYMMDD',
          placeholder: '请选择身份证有效期结束日期'
        },
        rules: [
          { required: true, message: '身份证有效期结束日期不能为空' }
        ]
      },
      {
        type: 'upload',
        label: '法人身份证正面照',
        key: 'frontIdCardImage',
        props: { limit: 1 },
        rules: [
          { required: true, message: '法人身份证正面照不能为空' }
        ]
      },
      {
        type: 'upload',
        label: '法人身份证反面照',
        key: 'backIdCardImage',
        props: { limit: 1 },
        rules: [
          { required: true, message: '法人身份证反面照不能为空' }
        ]
      },
      {
        type: 'upload',
        label: '法人手持证件照片',
        key: 'handIdCardImage',
        props: { limit: 1 },
        rules: [
          { required: true, message: '法人手持证件照片不能为空' }
        ]
      }
    ]
  })
  const SettlementAccountFormConfigs = computed(() => {
    const { bankCode, businessLicenceType } = merchant.value
    return [
      {
        label: '账户类型',
        type: 'radio',
        key: 'bankCardType',
        options: [
          { name: '个人账户', id: 'PERSONAL', disabled: businessLicenceType === 'CORPORATE' },
          { name: '对公账户', id: 'CORPORATE' }
        ]
      },
      {
        type: 'upload',
        label: '对公账户开户正面照片',
        key: 'frontBankCardImage',
        visible: { key: 'bankCardType', value: 'CORPORATE' },
        props: { limit: 1 }
      },
      {
        type: 'upload',
        label: '银行卡正面正面照片',
        key: 'frontBankCardImage',
        visible: { key: 'bankCardType', value: 'PERSONAL' },
        props: { limit: 1 }
      },
      {
        type: 'upload',
        label: '银行卡反面照片',
        key: 'backBankCardImage',
        visible: { key: 'bankCardType', value: 'PERSONAL' },
        props: { limit: 1 }
      },
      {
        type: 'input',
        label: '账号',
        key: 'bankCardNo',
        props: { placeholder: '请输入账号' }
      },
      {
        type: 'input',
        label: '开户省',
        key: 'openBankProvince',
        props: { placeholder: '请输入开户省' }
      },
      {
        type: 'input',
        label: '开户市',
        key: 'openBankCity',
        props: { placeholder: '请输入开户市' }
      },
      {
        type: 'remoteSearchSelect',
        label: '开户支行',
        key: 'bankName',
        props: {
          labelKey: 'subName',
          valueKey: 'subName',
          initialValue: bankCode,
          placeholder: '请输入开户银行',
          remoteMethod: (searchName: string) => useAxios().get('/default/banks', { params: { searchName } }),
          onChoose: (item: any) => merchant.value.bankCode = item.name
        }
      },
      {
        type: 'input',
        label: '开户行',
        disabled: true,
        key: 'bankCode',
        props: { placeholder: '请输入开户行' }
      },
      {
        type: 'input',
        label: '开户人姓名',
        key: 'openUserName',
        props: { placeholder: '请输入开户人姓名' }
      },
      {
        type: 'input',
        label: '开户人身份证号',
        key: 'openUserIdCardNo',
        props: { placeholder: '请输入开户人身份证号' }
      }
    ]
  })
  
  onMounted(() => GetList())
  
  const GetList = async () => {
    try {
      loading.value = true
      const response: any = await useAxios().get(`/default/local-merchant/audits`, {
        params: filterQuery.value
      })
      loading.value = false
      items.value = response?.items || []
      total.value = response?.total || 0
    } catch (e) {
      loading.value = false
    }
  }
  
  const opener = async (rows: any) => {
    const { id } = rows || {}
    if (id) {
      try {
        const response: any = await useAxios().get(`/default/local-merchant/audit-details/${id}`)
        if (Object.keys(response).length) {
          const { provinceId, cityId, districtId, streetId, ...rows } = response || {}
          merchant.value = Object.assign(rows, {
            addressCodes: [provinceId, cityId, districtId, streetId]
          })
          merchant.visible = true
        } else {
          ElMessage.error('数据获取失败')
        }
      } catch (e) {
        ElMessage.error('数据获取失败')
      }
    } else {
      merchant.value = {}
      merchant.visible = true
    }
  }
  
  const onSubmit = async () => {
    try {
      const { id, addressCodes = [] } = merchant.value
      merchant.loading = true
      await useAxios().put(`/default/local-merchant/audit-edit/${id}`, Object.assign(merchant.value, {
        provinceId: addressCodes[0],
        cityId: addressCodes[1],
        districtId: addressCodes[2],
        streetId: addressCodes[3]
      }))
      merchant.loading = false
      await GetList()
      merchant.visible = false
      ElMessage.success('操作成功')
    } catch (e) {
      merchant.loading = false
    }
  }

  const openReview = async (rows: any) => {
    try {
      const { state, ...items } = rows || {}
      if (state === 'PENDING_APPROVAL') {
        merchantReview.loading = {}
        merchantReview.value = items
        merchantReview.visible = true
        reviewFormRef.value?.clearValidate()
      } else {
        ElMessage.error('当前状态不允许审核')
      }
    } catch (e) {
      merchantReview.visible = false
    }
  }
  const onReview = async (action: string) => {
    try {
      const { id } = merchantReview.value
      if (id) {
        switch (action) {
          case '发起签署':
            merchantReview.loading.isSign = true
            await useAxios().post(`/default/local-merchant/template/${id}`)
            merchantReview.loading.isSign = false
            ElMessage.success('已发起签署')
            break
          case '商户进件':
            merchantReview.loading.register = true
            await useAxios().post(`/default/local-merchant/register-audit/${id}`)
            merchantReview.loading.register = false
            ElMessage.success('已发起商户进件')
            break
          case '商户报备':
            merchantReview.loading.report = true
            await useAxios().post(`/default/local-merchant/report-audit/${id}`)
            merchantReview.loading.report = false
            ElMessage.success('已发起商户报备')
            break
          case '提交微信认证':
            merchantReview.loading.wechatOpen = true
            await useAxios().post(`/default/local-merchant/wechat-open/${id}`)
            merchantReview.loading.wechatOpen = false
            ElMessage.success('已提交微信认证')
            break
          case '验证微信认证结果':
            merchantReview.loading.checkWechatOpen = true
            const response = await useAxios().post(`/default/local-merchant/check-wechat-open/${id}`)
            console.log(response)
            merchantReview.loading.checkWechatOpen = false
            ElMessageBox.alert(
              `
                <div class="text-center w-[400px] py-[50px]">
                  <img src='${response}' alt="Vue logo" class='w-[200px] h-[200px]' />
                </div>
                <div class="text-center my-6">
                  <span>请将该二维码图片发送给商户完成绑定</span>
                </div>
              `,
              '验证微信认证结果',
              {
                dangerouslyUseHTMLString: true,
                showCancelButton: false,
                showConfirmButton: false,
                draggable: true
              }
            )
            break
          case '验证':
            merchantReview.loading.openPayment = true
            await useAxios().post(`/default/local-merchant/validate-payment/${id}`)
            merchantReview.loading.openPayment = false
            ElMessage.success('已发起微信开户')
            break
          case '提交':
            await reviewFormRef.value?.validate()
            merchantReview.loading.submit = true
            await useAxios().post(`/default/local-merchant/audit/${id}`, merchantReview.value)
            merchantReview.loading.submit = false
            ElMessage.success('提交成功')
            break
        }
        await GetList()
        merchantReview.visible = false
      }
    } catch (e) {
      console.warn(e)
      merchantReview.loading = {}
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
              props: { placeholder: '请输入代理名称' }
            },
            {
              type: 'select',
              key: 'state',
              props: { placeholder: '请选择查询的状态', style: { width: '160px' }, clearable: true },
              options: [
                { name: '待审核', id: 'PENDING_APPROVAL' },
                { name: '审核通过', id: 'APPROVED' },
                { name: '审核拒绝', id: 'REJECTED' }
              ]
            },
            {
              type: 'input',
              key: 'companyName',
              props: { placeholder: '请输入公司名称' }
            }
          ]"
          columns="auto"
          v-model="filterQuery" />
        <el-button type="warning" class="ml-4" @click="GetList()">
          搜索
        </el-button>
      </div>
    </div>
  
    <div class="min-h-[320px]" v-loading="loading">
      <el-table :data="items" stripe height="calc(100vh - 200px)">
        <el-table-column prop="id" label="ID" align="center" width="60" />
        <el-table-column prop="legalName" label="法人姓名" align="center" />
        <el-table-column prop="shopName" label="店铺名称" align="center" />
        <el-table-column prop="companyName" label="公司名称" align="center" />
        <el-table-column prop="businessLicenceType" label="营业执照类型" align="center" width="120">
          <template #default="{ row }">
            <el-tag type="primary" v-if="row.businessLicenceType === 'CORPORATE'">对公账户</el-tag>
            <el-tag type="warning" v-else>对私账户</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发展人" align="center" width="120">
          <template #default="{ row }">
            <span>{{ row.agentName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isSign" label="是否签约" align="center">
          <template #default="{ row }">
            <el-tag type="primary" v-if="row.isSign">是</el-tag>
            <el-tag type="warning" v-else>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isRegister" label="银商进件" align="center">
          <template #default="{ row }">
            <el-tag type="primary" v-if="row.isRegister">是</el-tag>
            <el-tag type="warning" v-else>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isReport" label="银盛报备" align="center">
          <template #default="{ row }">
            <el-tag type="primary" v-if="row.isReport">是</el-tag>
            <el-tag type="warning" v-else>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isWechatOpen" label="是否微信开户" align="center" width="120">
          <template #default="{ row }">
            <el-tag type="primary" v-if="row.isWechatOpen">是</el-tag>
            <el-tag type="warning" v-else>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="openPayment" label="是否收款" align="center">
          <template #default="{ row }">
            <el-tag type="primary" v-if="row.openPayment">是</el-tag>
            <el-tag type="warning" v-else>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="memo" label="备注" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="{ row }">
            <el-tag type="primary" v-if="row.state == 'PENDING_APPROVAL'">待审核</el-tag>
            <el-tag type="success" v-else-if="row.state == 'APPROVED'">审核通过</el-tag>
            <el-tag type="warning" v-else-if="row.state == 'REJECTED'">已拒绝</el-tag>
            <span type="danger" v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template #default="{ row }">
            <div class="flex justify-center align-center">
              <el-button type="primary" link @click="opener(row)">编辑</el-button>
              <el-button type="warning" link @click="openReview(row)" v-if="row.state === 'PENDING_APPROVAL'">审核</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
  
      <div class="flex justify-end mt-4">
        <el-pagination
          background
          v-model:current-page="filterQuery.page"
          :page-sizes="[10, 20, 40, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @change="GetList()"
          :total="total"
          v-model:page-size="filterQuery.limit" />
      </div>
    </div>
  
    <el-dialog
      v-model="merchant.visible"
      title="修改商户信息"
      :close-on-click-modal="false"
      width="660">
      <el-tabs v-model="merchant.target" type="border-card">
        <el-tab-pane label="店铺信息" name="StoreInfo">
          <div class="max-h-[55vh] overflow-y-auto overflow-x-hidden">
            <FormKit v-model="merchant.value" :columns="2" :config="StoreInfoFormConfigs" ref="StoreInfoFormRef" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="公司主体" name="CompanyEntity">
          <div class="max-h-[55vh] overflow-y-auto overflow-x-hidden">
            <FormKit v-model="merchant.value" :columns="2" :config="CompanyEntityFormConfigs" ref="CompanyEntityFormRef" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="法人信息" name="LegalPersonInfo">
          <div class="max-h-[55vh] overflow-y-auto overflow-x-hidden">
            <FormKit v-model="merchant.value" :columns="2" :config="LegalPersonInfoFormConfigs" ref="LegalPersonInfoFormRef" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="结算账户" name="SettlementAccount">
          <div class="max-h-[55vh] overflow-y-auto overflow-x-hidden">
            <FormKit v-model="merchant.value" :columns="2" :config="SettlementAccountFormConfigs" ref="SettlementAccountFormRef" />
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="merchant.visible = false">关闭</el-button>
          <el-button type="primary" :loading="merchant.loading" @click="onSubmit()">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="merchantReview.visible"
      title="商户审核"
      width="600">
      <div class="max-h-[65vh] overflow-y-auto overflow-x-hidden">
        <el-steps direction="vertical" align-center :active="-1">
          <el-step title="商户电子合同填写与发起签署">
            <template #description>
              <div class="mt-3 mb-4">
                <el-button
                  type="primary"
                  :disabled="merchantReview.value.isSign === true"
                  :loading="merchantReview.loading?.isSign"
                  @click="onReview('发起签署')"
                  plain>
                  发起签署
                </el-button>
              </div>
            </template>
          </el-step>
          <el-step title="商户进件">
            <template #description>
              <div class="mt-3 mb-4">
                <el-button
                  type="primary"
                  :disabled="merchantReview.value.isRegister === true"
                  :loading="merchantReview.loading?.register"
                  @click="onReview('商户进件')"
                  plain>
                  商户进件
                </el-button>
              </div>
            </template>
          </el-step>
          <el-step title="商户报备">
            <template #description>
              <div class="mt-3 mb-4">
                <el-button
                  type="primary"
                  :loading="merchantReview.loading?.report"
                  :disabled="merchantReview.value.isReport === true"
                  @click="onReview('商户报备')"
                  plain>
                  商户报备
                </el-button>
              </div>
            </template>
          </el-step>
          <el-step title="提交微信认证">
            <template #description>
              <div class="mt-3 mb-4">
                <el-button type="primary" :loading="merchantReview.loading?.wechatOpen" :disabled="merchantReview.value.isWechatOpen === true" @click="onReview('提交微信认证')" plain>微信开户</el-button>
              </div>
            </template>
          </el-step>
          <el-step title="验证微信认证结果">
            <template #description>
              <div class="mt-3 mb-4">
                <el-button type="primary" :loading="merchantReview.loading?.checkWechatOpen" :disabled="merchantReview.value.isWechatSuccess === true" @click="onReview('验证微信认证结果')" plain>验证微信认证</el-button>
              </div>
            </template>
          </el-step>
          <el-step title="商户全流程校验">
            <template #description>
              <div class="mt-3 mb-4">
                <el-button type="primary" :loading="merchantReview.loading?.openPayment" :disabled="merchantReview.value.openPayment === true" @click="onReview('验证')" plain>验证</el-button>
              </div>
            </template>
          </el-step>
          <el-step title="审核">
            <template #description>
              <div class="mt-3 mb-4">
                <FormKit
                  :config="[
                    {
                      type: 'radio',
                      key: 'state',
                      rules: [
                        { required: true, message: '请选择审核结果' }
                      ],
                      props: { type: 'button', textColor: '626aef', fill: 'rgb(239, 240, 253)' },
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
                  v-model="merchantReview.value"
                  ref="reviewFormRef" />
                <div>
                  <el-button type="primary" :loading="merchantReview.loading.submit" @click="onReview('提交')" plain>提交审核</el-button>
                </div>
              </div>
            </template>
          </el-step>
        </el-steps>
      </div>
    </el-dialog>
  </template>

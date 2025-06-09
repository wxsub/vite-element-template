<route>
    { meta: { title: "公司管理" } }
</route>

<script setup lang="ts">
import FormKit from "@/components/FormKit/index.vue"
type FormKitInstance = InstanceType<typeof FormKit>
type dialogDataType = {
    visible: boolean;
    loading: boolean;
    id: number | null;
    value: any;
}

const filterQuery = ref({
        page: 1,
        limit: 10
    }),
    dialogDataSetFormRef = ref<FormKitInstance>(),
    items: any = ref([]),
    total = ref(0),
    dialogDataSet = reactive<dialogDataType>({
        visible: false,
        loading: false,
        id: null,
        value: {}
    }),
    loading = ref(false);

const configs = computed(() => {
  return [
    {
        type: 'input',
        label: '公司名称',
        rules: [
            { required: true, message: '公司名称不能为空' }
        ],
        key: 'companyName',
        props: { placeholder: '请输入公司名称' }
    },
    {
        type: 'input',
        label: '公司电话',
        rules: [
            { required: true, message: '公司电话不能为空' }
        ],
        key: 'companyPhone',
        props: { placeholder: '请输入公司电话' }
    },
    {
        type: 'select',
        label: '营业执照类型',
        key: 'businessLicenceType',
        rules: [
            { required: true, message: '营业执照类型不能为空' }
        ],
        options: [
            { name: '个体工商户', id: 'INDIVIDUAL' },
            { name: '企业', id: 'CORPORATE' }
        ]
    },
    {
        type: 'input',
        label: '统一社会信用代码',
        rules: [
            { required: true, message: '统一社会信用代码不能为空' }
        ],
        key: 'companyCode',
        props: { placeholder: '请输入统一社会信用代码' }
    },
    {
        type: 'upload',
        label: '营业执照图片',
        key: 'businessLicenceImage',
        props: { limit: 1 }
    },
    {
        type: 'radio',
        label: '有效期是否为永久',
        key: 'isPermanentCompany',
        rules: [
            { required: true, message: '有效期是否为永久不能为空' }
        ],
        options: [
            { name: '是', id: 1 },
            { name: '否', id: 0 }
        ]
    },
    {
        type: 'datePicker',
        label: '注册日期',
        key: 'companyStartPeriodDate',
        props: {
          style: { width: '100%' },
          valueFormat: 'YYYY-MM-DD',
          placeholder: '请选择注册日期'
        },
        rules: [
          { required: true, message: '注册日期不能为空' }
        ]
    },
    {
        type: 'datePicker',
        label: '有效日期',
        key: 'companyEndPeriodDate',
        props: {
          style: { width: '100%' },
          valueFormat: 'YYYY-MM-DD',
          placeholder: '请选择有效日期'
        },
        rules: [
          { required: true, message: '有效日期不能为空' }
        ]
    },
    {
        type: 'input',
        label: '公司地址信息',
        key: 'registeredAddress',
        props: { placeholder: '请选择公司地址信息' },
        rules: [
          { required: true, message: '公司地址信息不能为空' }
        ]
    },
    {
        type: 'input',
        label: '法人姓名',
        rules: [
            { required: true, message: '法人姓名不能为空' }
        ],
        key: 'legalName',
        props: { placeholder: '请输入法人姓名' }
    },
    {
        type: 'input',
        label: '法人手机号',
        rules: [
            { required: true, message: '法人手机号不能为空' },
            { pattern: /^1[3456789]\d{9}$/, message: '法人手机号码格式不正确', trigger: 'blur' }
        ],
        key: 'legalPhoneNo',
        props: { placeholder: '请输入法人手机号' }
    },
    {
        type: 'input',
        label: '法人身份证号',
        rules: [
            { required: true, message: '法人身份证号不能为空' }
        ],
        key: 'legalIdCardNo',
        props: { placeholder: '请输入法人身份证号' }
    },
    {
        type: 'upload',
        label: '法人身份证正面照片',
        key: 'frontIdCardImage',
        props: { limit: 1 }
    },
    {
        type: 'upload',
        label: '法人身份证反面照片',
        key: 'backIdCardImage',
        props: { limit: 1 }
    },
    {
        type: 'upload',
        label: '法人手持身份证照片',
        key: 'handIdCardImage',
        props: { limit: 1 }
    },
    {
        type: 'radio',
        label: '身份证有效期是否为永久',
        key: 'isPermanentIdCard',
        span: 24,
        rules: [
            { required: true, message: '身份证有效期是否为永久不能为空' }
        ],
        options: [
            { name: '是', id: 1 },
            { name: '否', id: 0 }
        ]
    },
    {
        type: 'datePicker',
        label: '身份证有效期开始日期',
        key: 'idCardStartPeriodDate',
        visible: { key: 'isPermanentCompany', value: false },
        props: {
          style: { width: '100%' },
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
        visible: { key: 'isPermanentCompany', value: false },
        props: {
          style: { width: '100%' },
          placeholder: '请选择身份证有效期结束日期'
        },
        rules: [
          { required: true, message: '身份证有效期结束日期不能为空' }
        ]
    },
    {
        type: 'input',
        label: '身份证地址',
        key: 'idCardAddress',
        props: { placeholder: '请输入身份证地址' }
    },
    {
        type: 'radio',
        label: '账户类型',
        key: 'bankCardType',
        rules: [
            { required: true, message: '账户类型不能为空' }
        ],
        options: [
            { name: '对私账户', id: 'PERSONAL' },
            { name: '对公账户', id: 'CORPORATE' }
        ]
    },
    {
        type: 'radio',
        label: '账户子类型',
        key: 'accType',
        rules: [
            { required: true, message: '账户子类型不能为空' }
        ],
        options: [
            { name: '借记卡', id: 'DEBIT_CARD' },
            { name: '单位结算卡', id: 'UNIT_CARD' }
        ]
    },
    {
        type: 'input',
        label: '银行编码',
        rules: [
            { required: true, message: '银行编码不能为空' }
        ],
        key: 'bankCode',
        props: { placeholder: '请输入银行编码' }
    },
    {
        type: 'input',
        label: '银行名称',
        rules: [
            { required: true, message: '银行名称不能为空' }
        ],
        key: 'bankName',
        props: { placeholder: '请输入银行名称' }
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
    },
    {
        type: 'input',
        label: '银行卡账号',
        rules: [
            { required: true, message: '银行卡账号不能为空' }
        ],
        key: 'bankCardNo',
        props: { placeholder: '请输入银行卡账号' }
    },
    {
        type: 'select',
        label: '结算类型',
        key: 'settlementType',
        rules: [
            { required: true, message: '结算类型不能为空' }
        ],
        options: [
            { name: '平台内账户', id: 'PLATFORM_ACCOUNT' },
            { name: '银行卡账户', id: 'BANK_CARD_ACCOUNT' }
        ]
    },
    {
        type: 'upload',
        label: '银行卡正面照片',
        key: 'frontBankCardImage',
        props: { limit: 1 }
    },
    {
        type: 'upload',
        label: '银行卡反面照片',
        key: 'backBankCardImage',
        props: { limit: 1 }
    },
    {
        type: 'upload',
        label: '开户许可证',
        key: 'proveImage',
        props: { limit: 1 }
    },
    {
        type: 'radio',
        label: '结算类型',
        key: 'state',
        rules: [
            { required: true, message: '结算类型不能为空' }
        ],
        options: [
            { name: '已上架', id: 'PUBLISHED' },
            { name: '已下架', id: 'UNPUBLISHED' }
        ]
    },
    {
        type: 'input',
        label: '备注',
        key: 'memo',
        span: 24,
        props: { placeholder: '请输入备注', type: 'textarea' }
    }
  ]
})

onMounted(() => GetList())

const GetList = async () => {
    try {
        loading.value = true
        const response: any = await useAxios().get(`/default/local-manager-company/list`, {
            params: filterQuery.value
        })
        loading.value = false
        items.value = response?.items || []
        total.value = response?.total || 0
    } catch (e) {
        loading.value = false
    }
}

const opener = async (id: number | null) => {
    dialogDataSet.visible = true
    if (id) {
        dialogDataSet.id = id
        try {
            dialogDataSet.loading = true
            const response: any = await useAxios().get(`/default/local-manager-company/detail/${id}`)
            dialogDataSet.loading = false
            dialogDataSet.value = response || {}
            setTimeout(() => {
                dialogDataSetFormRef.value?.clearValidate()
            }, 200)
        } catch (error) {
            ElMessage.warning(String(error))
            dialogDataSet.visible = false
            dialogDataSet.loading = false
        }
    } else {
        dialogDataSet.id = null
        dialogDataSet.value = {}
        setTimeout(() => {
            dialogDataSetFormRef.value?.clearValidate()
        }, 200)
    }
}

const onSubmit = async () => {
    try {
        await dialogDataSetFormRef.value?.validate()
        dialogDataSet.loading = true
        if (dialogDataSet.id) {
            await useAxios().put(`/default/local-manager-company/edit/${dialogDataSet.id}`, dialogDataSet.value)
        } else {
            await useAxios().post(`/default/local-manager-company/create`, dialogDataSet.value)
        }
        ElMessage.success('操作成功')
        dialogDataSet.visible = false
        GetList()
    } catch (error) {
        ElMessage.warning(String(error))
    } finally {
        dialogDataSet.loading = false
    }
}
</script>

<template>
    <div class="flex align-center gap-[16px]">
        <div class="flex align-center">
            <FormKit :config="[
                {
                    type: 'input',
                    key: 'companyName',
                    props: { placeholder: '请输入公司名称', style: { width: '120px' } }
                },
                {
                    type: 'select',
                    key: 'businessLicenceType',
                    props: { placeholder: '请选择营业执照类型', style: { width: '180px' } },
                    options: [
                        { name: '个体工商户', id: 'INDIVIDUAL' },
                        { name: '企业', id: 'CORPORATE' }
                    ]
                },
                {
                    type: 'input',
                    key: 'legalName',
                    props: { placeholder: '请输入法人姓名', style: { width: '130px' } }
                },
                {
                    type: 'select',
                    key: 'state',
                    props: { placeholder: '请选择状态', style: { width: '150px' } },
                    options: [
                        { name: '等待审核', id: 'PENDING_APPROVAL' },
                        { name: '审核通过', id: 'APPROVED' },
                        { name: '审核不通过', id: 'REJECTED' }
                    ]
                }
            ]" columns="auto" v-model="filterQuery">
                <template #append>
                    <el-col :span="null">
                        <el-button type="warning" @click="GetList()">搜索</el-button>
                    </el-col>
                    <el-col :span="null">
                        <el-button type="primary" @click="opener(null)">新增公司</el-button>
                    </el-col>
                </template>
            </FormKit>
        </div>
    </div>
    
    <div class="min-h-[320px]" v-loading="loading">
        <el-table :data="items" stripe>
            <el-table-column prop="id" label="id" align="center" width="70" />
            <el-table-column label="公司名称" align="center">
            <template #default="{ row }">
                <span>{{ row.companyName || '-' }}</span>
            </template>
            </el-table-column>
            <el-table-column label="公司编码" align="center">
            <template #default="{ row }">
                <span>{{ row.companyCode || '-' }}</span>
            </template>
            </el-table-column>
            <el-table-column label="营业执照图片" align="center" width="110">
            <template #default="{ row }">
                <el-image
                    :src="row.businessLicenceImage"
                    :zoom-rate="1.2"
                    class="w-[70px] h-[70px] rounded-lg"
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="[row.businessLicenceImage]"
                    preview-teleported
                    show-progress
                    fit="cover"
                />
            </template>
            </el-table-column>
            <el-table-column label="营业执照有效期" align="center" width="130">
            <template #default="{ row }">
                <span>{{ row.permanentCompanyText || '-' }}</span>
            </template>
            </el-table-column>
            <el-table-column label="法人身份证正面照片" align="center" width="150">
                <template #default="{ row }">
                    <el-image
                        :src="row.frontIdCardImage"
                        :zoom-rate="1.2"
                        class="w-[70px] h-[70px] rounded-lg"
                        :max-scale="7"
                        :min-scale="0.2"
                        :preview-src-list="[row.frontIdCardImage]"
                        preview-teleported
                        show-progress
                        fit="cover"
                    />
                </template>
            </el-table-column>
            <el-table-column label="法人身份证反面照" align="center" width="150">
                <template #default="{ row }">
                    <el-image
                        :src="row.backIdCardImage"
                        :zoom-rate="1.2"
                        class="w-[70px] h-[70px] rounded-lg"
                        :max-scale="7"
                        :min-scale="0.2"
                        :preview-src-list="[row.backIdCardImage]"
                        preview-teleported
                        show-progress
                        fit="cover"
                    />
                </template>
            </el-table-column>
            <el-table-column prop="legalName" label="法人姓名" align="center" />
            <el-table-column prop="legalIdCardNo" label="法人身份证号" align="center" width="120" />
            <el-table-column prop="permanentIdCardText" label="身份证有效期" align="center" width="120" />
            <el-table-column prop="legalPhoneNo" label="法人电话" align="center" />
            <el-table-column prop="idCardAddress" label="身份证地址" align="center" width="130" show-overflow-tooltip />
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
                <el-button type="primary" link @click="opener(row.id)">编辑</el-button>
            </template>
            </el-table-column>
        </el-table>

        <div class="flex justify-end mt-4" v-if="total >= filterQuery.limit">
            <el-pagination background v-model:current-page="filterQuery.page" layout="prev, pager, next"
                @change="GetList()" :total="total" :page-size="filterQuery.limit" />
        </div>
    </div>

    <el-dialog v-model="dialogDataSet.visible" title="新增" :close-on-click-modal="false" width="550">
        <div class="min-h-[320px] max-h-[65vh] overflow-y-auto overflow-x-hidden" v-loading="dialogDataSet.loading">
            <FormKit :config="configs" :columns="2" v-model="dialogDataSet.value" ref="dialogDataSetFormRef" />
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogDataSet.visible = false">关闭</el-button>
                <el-button type="primary" :loading="dialogDataSet.loading" @click="onSubmit">提交</el-button>
            </div>
        </template>
    </el-dialog>
</template>
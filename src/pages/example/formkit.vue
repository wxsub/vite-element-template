<route>
    { meta: { title: "FormKit组件演示" } }
</route>

<script setup lang="ts">
import FormKit, { type Instance, registerModule } from 'element-plus-formkit';

registerModule('editor', defineAsyncComponent(() => import("@/components/Editor/index.vue")))

type detailDailogType = {
    visible: boolean,
    items: any,
    loading?: boolean
    id: number | null
    value: any,
    total?: number
    page?: number
}

const Query = ref({ name: null, page: 1, limit: 10 }),
    total = ref(0),
    formKitRef = ref<Instance>(),
    loading = ref(false),
    detailDailog = reactive<detailDailogType>({ visible: false, items: [], id: null, value: {} }),
    items: any = ref([]);

const EditConfigs = computed(() => {
    const { bankCode, businessLicenceType } = detailDailog.value
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
          labelKey: 'bankName',
          valueKey: 'bankName',
          initialValue: bankCode,
          placeholder: '请输入开户银行',
          remoteMethod: (searchName: string) => useAxios().get('/form/banks', { params: { searchName } }),
          onChoose: (item: any) => detailDailog.value.bankCode = item.bankid
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
      },
      {
        type: 'editor',
        label: '备注',
        key: 'remark',
        span: 24,
        props: { placeholder: '请输入备注' }
      }
    ]
})

const opener = async (rows: any) => {
    const { id } = rows || {}
    detailDailog.visible = true
    if (id) {
      detailDailog.value = {}
    } else {
      detailDailog.value = {}
    }
}

async function onSubmit() {
    try {
      await formKitRef.value?.validate(true)
      detailDailog.loading = true
      await useAxios().put(`/default/local-merchant/audit-edit`, detailDailog.value)
      detailDailog.loading = false
      detailDailog.visible = false
      ElMessage.success('操作成功')
    } catch (e) {
      detailDailog.loading = false
    }
}
</script>

<template>
    <div class="flex align-center gap-[16px]">
        <FormKit
            :config="[
                {
                    type: 'input',
                    key: 'name',
                    props: { placeholder: '请输入姓名' }
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
                }
            ]"
            columns="auto"
            v-model="Query">
            <template #append>
                <el-col :span="null">
                    <el-button type="warning">
                        <el-icon><i-ep-search /></el-icon>
                        <span>搜索</span>
                    </el-button>
                </el-col>
                <el-col :span="null">
                    <el-button type="primary" @click="opener">
                        <el-icon><i-ep-plus /></el-icon>
                        <span>新增</span>
                    </el-button>
                </el-col>
            </template>
        </FormKit>
    </div>

    <div class="mt-4 min-h-[320px]" v-loading="loading">
        <el-table :data="items" stripe>
            <el-table-column prop="id" label="ID" align="center" width="60" />
            <el-table-column prop="agentName" label="姓名" align="center" />
            <el-table-column prop="accountNo" label="账号" align="center" />
            <el-table-column prop="salary" label="薪资" align="center" />
            <el-table-column prop="available" label="可用薪资" align="center" />
            <el-table-column prop="createTime" label="薪资月份" align="center" />
            <el-table-column label="操作" align="center" width="120">
                <template #default="{ row }">
                    <el-button type="primary" link>编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="flex justify-end mt-4">
            <el-pagination background v-model:current-page="Query.page" layout="prev, pager, next" :total="total"
                :page-size="Query.limit" />
        </div>

        <el-dialog v-model="detailDailog.visible" title="编辑" :close-on-click-modal="false" width="600">
            <FormKit v-model="detailDailog.value" :columns="2" :config="EditConfigs" ref="formKitRef" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="detailDailog.visible = false">关闭</el-button>
                    <el-button type="primary" @click="onSubmit()" :loading="detailDailog.loading">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
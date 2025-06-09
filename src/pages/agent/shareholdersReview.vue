<route>
    { meta: { title: "股东审核" } }
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

const Query = ref({ name: null, page: 1, limit: 10 }),
    total = ref(0),
    reviewFormRef = ref<FormKitInstance>(),
    loading = ref(false),
    reviewDailog = reactive<reviewDailogType>({ visible: false, value: {}, id: null }),
    items: any = ref([]);

onMounted(() => GetList())

const GetList = async () => {
    try {
        loading.value = true
        const response: any = await useAxios().get('/default/shareholder-audit/shareholder-list', { params: Query.value })
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
        const response: any = await useAxios().post('/default/shareholder-audit/audit-shareholder', Object.assign(reviewDailog.value, { id }))
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
            <el-table-column prop="id" label="ID" align="center" width="60" />
            <el-table-column prop="name" label="股东姓名" align="center" />
            <el-table-column prop="agentName" label="所属代理" align="center" />
            <el-table-column prop="merchantPhoneNo" label="股东手机号" align="center" />
            <el-table-column label="状态" align="center">
                <template #default="{ row }">
                    <el-tag type="primary" v-if="row.auditStatus === 'AUDITING'">待审核</el-tag>
                    <el-tag type="success" v-else-if="row.auditStatus === 'AUDITED'">审核通过</el-tag>
                    <el-tag type="warning" v-else-if="row.auditStatus === 'AUDIT_FAIL'">审核失败</el-tag>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column prop="createdTime" label="时间" align="center" />
            <el-table-column label="操作" align="center" width="120">
                <template #default="{ row }">
                    <el-button type="primary" link @click="opener(row.id)" :disabled="row.auditStatus !== 'AUDITING'">审核</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="flex justify-end mt-4" v-if="total >= Query.limit">
            <el-pagination background v-model:current-page="Query.page" layout="prev, pager, next" @change="GetList()"
                :total="total" :page-size="Query.limit" />
        </div>

        <el-dialog v-model="reviewDailog.visible" title="审核" :close-on-click-modal="false" width="420">
            <FormKit :config="[
                {
                    type: 'radio',
                    key: 'auditStatus',
                    rules: [
                        { required: true, message: '请选择审核结果' }
                    ],
                    options: [
                        { name: '同意', id: 'AUDITED' },
                        { name: '拒绝', id: 'AUDIT_FAIL' }
                    ]
                },
                {
                    type: 'input',
                    label: '审核意见',
                    key: 'auditResult',
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
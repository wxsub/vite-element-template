<route>
    { meta: { title: "团队业绩" } }
</route>

<script setup lang="ts">
type dialogDataType = {
    visible: boolean;
    loading: boolean;
    path?: string;
    query: any;
    total: number;
    items: any;
}

const filterQuery = ref({
        page: 1,
        limit: 10
    }),
    items: any = ref([]),
    total = ref(0),
    dialogDataSet = reactive<dialogDataType>({
        visible: false,
        loading: false,
        query: {},
        total: 0,
        items: []
    }),
    loading = ref(false);

onMounted(() => GetList())

const GetList = async () => {
    try {
        loading.value = true
        const response: any = await useAxios().get(`/default/local-trend/team-achievements`, {
            params: filterQuery.value
        })
        loading.value = false
        items.value = response?.items || []
        total.value = response?.total || 0
    } catch (e) {
        loading.value = false
    }
}

const opener = (path: string) => {
    if (path) {
        dialogDataSet.visible = true
        dialogDataSet.path = path
        dialogDataSet.query = { page: 1, name: '', limit: 10 }
        fetchAchievements()
    } else {
        ElMessage.error("path不合法")
    }
}

const fetchAchievements = async () => {
    try {
        dialogDataSet.loading = true
        const path = dialogDataSet.path || ''
        const response: any = await useAxios().get(`/default/local-trend/team/${path}/achievements`, {
            params: dialogDataSet.query
        })
        console.log(response)
        dialogDataSet.loading = false
        dialogDataSet.items = response?.items || []
        dialogDataSet.total = response?.total || 0
    } catch (e) {
        dialogDataSet.loading = false
        ElMessage.error("获取数据失败")
    }
}
</script>

<template>
    <div class="flex align-center gap-[16px]">
        <div class="flex align-center">
            <FormKit :config="[
                {
                    type: 'input',
                    key: 'name',
                    props: { placeholder: '请输入商务名称' }
                }
            ]" columns="auto" v-model="filterQuery">
                <template #append>
                    <el-col :span="null">
                        <el-button type="warning" @click="GetList()">搜索</el-button>
                    </el-col>
                </template>
            </FormKit>
        </div>
    </div>
    <div class="min-h-[320px]" v-loading="loading">
        <el-table :data="items" stripe>
            <el-table-column prop="id" label="ID" align="center" width="60" />
            <el-table-column prop="teamName" label="所属团队" align="center" />
            <el-table-column prop="totalAmount" label="团队业绩" align="center" />
            <el-table-column prop="teamMemberCount" label="团队成员数" align="center" />
            <el-table-column prop="levelName" label="等级" align="center" />
            <el-table-column label="操作" align="center" width="180">
                <template #default="{ row }">
                    <div class="flex justify-center align-center">
                        <el-button type="primary" link @click="opener(row.path)">团队明细</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <div class="flex justify-end mt-4" v-if="total >= filterQuery.limit">
            <el-pagination background v-model:current-page="filterQuery.page" layout="prev, pager, next"
                @change="GetList()" :total="total" :page-size="filterQuery.limit" />
        </div>
    </div>

    <el-dialog v-model="dialogDataSet.visible" title="团队明细" :close-on-click-modal="false" width="520">
        <div>
            <FormKit :config="[
                {
                    type: 'input',
                    key: 'name',
                    props: { placeholder: '请输入商务名称', clearable: true }
                }
            ]" v-model="dialogDataSet.query" columns="auto">
                <template #append>
                    <el-col :span="null">
                        <el-button type="warning" @click="fetchAchievements()">搜索</el-button>
                    </el-col>
                </template>
            </FormKit>
            <div class="min-h-[320px]" v-loading="dialogDataSet.loading">
                <el-table :data="dialogDataSet.items" stripe>
                    <el-table-column prop="agentName" label="商务名称" align="center" />
                    <el-table-column prop="accountNo" label="商务账号" align="center" />
                    <el-table-column prop="totalAmount" label="个人业绩" align="center" />
                    <el-table-column prop="levelName" label="等级" align="center" />
                </el-table>

                <div class="flex justify-end mt-4" v-if="dialogDataSet.total >= dialogDataSet.query.limit">
                    <el-pagination background v-model:current-page="dialogDataSet.query.page" layout="prev, pager, next"
                        @change="fetchAchievements()" :total="dialogDataSet.total" :page-size="dialogDataSet.query.limit" />
                </div>
            </div>
        </div>
    </el-dialog>
</template>
<route>
    { meta: { title: "区域业绩" } }
</route>

<script setup lang="ts">
import type Node from 'element-plus/es/components/tree/src/model/node'
type dialogDataType = {
    visible: boolean;
    loading: boolean;
    total: number;
    query?: any;
    items: any;
}
interface Tree {
  name: string
  leaf?: boolean
}

const types = ['PROVINCE', 'CITY', 'AREA', 'STREET']

const dialogDataSet = reactive<dialogDataType>({
        visible: false,
        loading: false,
        total: 0,
        query: { page: 1, limit: 10 },
        items: []
    }),
    filterQuery: any = reactive({
        page: 1,
        limit: 10
    }),
    statistics: any = ref({}),
    areas: Tree[] = [],
    loading = ref(false),
    items = ref<[]>([]),
    total = ref(0);

onMounted(() => fetchStatistics())

const GetList = async () => {
    try {
        loading.value = true
        const response: any = await useAxios().get(`/default/local-trend/area/shop-achievements`, {
            params: filterQuery
        })
        items.value = response?.items || []
        total.value = response?.total || 0
    } catch (e) {
        console.log(e)
    } finally {
        loading.value = false
    }
}

const onTreeNodeClick = (row: any) => {
    const { areaId, level } = row || {},
        cityType = types[level];
    filterQuery.page = 1
    filterQuery.areaId = areaId
    filterQuery.cityType = cityType
    GetList()
}

const loadNode = (
    node: Node,
    resolve: (data: Tree[]) => void,
    reject: () => void
) => {
    const { data, level } = node || {},
        { areaId } = data || {};
    try {
        useAxios().get(`/default/local-trend/area-achievements`, {
            params: { areaId, cityType: types[level] }
        }).then((response: any) => {
            const items = response || []
            resolve(items.map((item: any) => ({
                ...item,
                level,
                leaf: level >= 2
            })))
        }).catch(() => {
            reject()
        })
    } catch (e) {
        reject()
    }
}

async function fetchStatistics() {
    useAxios().get(`/default/local-trend/all-acheivment`).then((response: any) => {
        console.log(response)
        statistics.value = response || {}
    })
}

const fetchShop = async (id?: number) => {
    try {
        if (id) {
            dialogDataSet.query.page = 1
            dialogDataSet.query.shopId = id
            dialogDataSet.visible = true
        }
        dialogDataSet.loading = true
        const response: any = await useAxios().get(`/default/local-trend/area/shop-order-list`, {
            params: dialogDataSet.query
        })
        dialogDataSet.items = response?.items || []
        dialogDataSet.total = response?.total || 0
    } catch (e) {
        console.log(e)
    } finally {
        dialogDataSet.loading = false
    }
}
</script>

<template>
    <div class="min-h-[320px] flex gap-x-[2.5vw]">
        <div class="w-[400px]">
            <div class="flex items-center text-center bg-[#f5f5f5] rounded-lg px-1 py-3">
                <div class="flex-1">
                    <p class="overflow-hidden text-ellipsis whitespace-wrap">
                        <b class="text-[#333] text-[14px]">{{ statistics?.orderAmount || 0 }}</b>
                    </p>
                    <p class="text-[#666] text-[12px]">订单总额</p>
                </div>
                <div class="flex-1">
                    <p class="overflow-hidden text-ellipsis whitespace-wrap">
                        <b class="text-[#333] text-[14px]">{{ statistics?.points || 0 }}</b>
                    </p>
                    <p class="text-[#666] text-[12px]">积分总额</p>
                </div>
                <div class="flex-1">
                    <p class="overflow-hidden text-ellipsis whitespace-wrap">
                        <b class="text-[#333] text-[14px]">{{ statistics?.shopCount || 0 }}</b>
                    </p>
                    <p class="text-[#666] text-[12px]">店铺总数</p>
                </div>
            </div>
            <div class="mt-4 max-h-[50vh] overflow-y-auto overflow-x-hidden">
                <el-tree
                    :data="areas"
                    :props="{ children: 'children', label: 'areaName', isLeaf: 'leaf' }"
                    :highlight-current="true"
                    :expand-on-click-node="false"
                    :load="loadNode"
                    @node-click="onTreeNodeClick"
                    lazy>
                    <template #default="{ node, data }">
                        <div class="flex justify-between items-center w-[200px]">
                            <div>{{ node.label }}</div>
                            <el-tooltip
                                effect="light"
                                :content="`业绩：${data?.points || 0} &nbsp;&nbsp; 店铺数量：${data?.shopCount || 0}`"
                                placement="right">
                                <div class="flex gap-[16px] items-center">
                                    <span class="flex items-center gap-[2px]">
                                        <el-icon><i-ep-pieChart /></el-icon>
                                        <span>{{ data?.points || 0 }}</span>
                                    </span>
                                    <span class="flex items-center gap-[2px]">
                                        <el-icon><i-ep-handbag /></el-icon>
                                        <span>{{ data?.shopCount || 0 }}</span>
                                    </span>
                                </div>
                            </el-tooltip>
                        </div>
                    </template>
                </el-tree>
            </div>
        </div>
        <div class="flex-1 bg-[#f5f5f5] rounded-lg px-4 py-3">
            <div class="flex align-center">
                <FormKit :config="[
                    {
                        type: 'input',
                        key: 'name',
                        props: { placeholder: '请输入店铺名称' }
                    }
                ]" columns="auto" v-model="filterQuery">
                    <template #append>
                        <el-col :span="null">
                            <el-button type="warning" @click="GetList()">搜索</el-button>
                        </el-col>
                    </template>
                </FormKit>
            </div>
            <div v-loading="loading">
                <el-table :data="items" stripe height="calc(100vh - 300px)">
                    <el-table-column prop="shopId" label="ID" align="center" width="60" />
                    <el-table-column prop="shopName" label="店铺名称" align="center" />
                    <el-table-column prop="staffId" label="商务ID" align="center" />
                    <el-table-column prop="agentName" label="所属商务" align="center" />
                    <el-table-column prop="points" label="业绩总额" align="center" />
                    <el-table-column prop="orderCount" label="订单总数" align="center" />
                    <el-table-column prop="orderAmount" label="订单总额" align="center" />
                    <el-table-column prop="createdTime" label="入驻时间" align="center" />
                    <el-table-column label="操作" align="center" width="100">
                        <template #default="{ row }">
                            <div class="flex justify-center align-center">
                                <el-button type="primary" link @click="fetchShop(row.shopId)">查看明细</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="flex justify-end mt-4" v-if="total >= filterQuery.limit">
                    <el-pagination background v-model:current-page="filterQuery.page" layout="prev, pager, next"
                        @change="GetList()" :total="total" :page-size="filterQuery.limit" />
                </div>
            </div>
        </div>
    </div>

    <el-dialog v-model="dialogDataSet.visible" title="店铺明细" :close-on-click-modal="false" width="560">
        <div v-loading="dialogDataSet.loading">
                <el-table :data="dialogDataSet.items" stripe height="55vh">
                    <el-table-column prop="orderNo" label="订单编号" align="center" />
                    <el-table-column prop="shopName" label="所属店铺" align="center" />
                    <el-table-column prop="orderAmount" label="订单金额" align="center" />
                    <el-table-column prop="points" label="让利积分" align="center">
                        <template #default="{ row }">
                            <b class="text-red-500" v-if="row.points">{{ row.points }}</b>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createdTime" label="订单时间" align="center" />
                </el-table>

                <div class="flex justify-end mt-4" v-if="dialogDataSet.total >= dialogDataSet.query.limit">
                    <el-pagination background v-model:current-page="dialogDataSet.query.page" layout="prev, pager, next"
                        @change="fetchShop()" :total="dialogDataSet.total" :page-size="dialogDataSet.query.limit" />
                </div>
            </div>
    </el-dialog>
</template>
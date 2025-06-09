<route>
{ meta: { title: "商务管理" } }
</route>

<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import FormKit from "@/components/FormKit/index.vue"
import { cloneDeep, isNumber } from "lodash"
type FormKitInstance = InstanceType<typeof FormKit>
type producerType = {
  visible: boolean,
  value: any,
  loading?: boolean
}
type teamsType = {
  visible: boolean,
  level: any[],
  items: any[],
  id: number | null,
  name?: string,
  page: number,
  total: number,
  loading?: boolean
}

const Query = ref({ agentName: null, page: 1, limit: 10 }),
  total = ref(0),
  formKitRef = ref<FormKitInstance>(),
  loading = ref(false),
  items: any = ref([]),
  Teams = reactive<teamsType>({
    visible: false,
    level: [],
    items: [],
    id: null,
    total: 0,
    page: 1
  }),
  Producer = reactive<producerType>({
    visible: false,
    value: { promoterAccountType: 'COMMERCIAL', addressCodes: [] },
    loading: false
  });

const managerLevelOptions = [
  { name: '见习商务经理', id: 'BUSINESS_TRAINEE' },
  { name: '初级商务经理', id: 'JUNIOR_BUSINESS' },
  { name: '中级商务经理', id: 'INTERMEDIATE_BUSINESS' },
  { name: '高级商务经理', id: 'SENIOR_BUSINESS' },
  { name: '商务总监一级', id: 'BUSINESS_MANAGER' },
  { name: '商务总监二级', id: 'SENIOR_MANAGER' },
  { name: '商务总监三级', id: 'BUSINESS_DIRECTOR' }
]

const configs = computed(() => {
  const { agentAreaType, tutorName, recommenderName } = Producer.value || {},
    level = Number(agentAreaType) - 1;
  return [
    {
      type: 'radio',
      label: '账号类型',
      key: 'promoterAccountType',
      rules: [
        { required: true, message: '账号类型不能为空' }
      ],
      options: [
        { name: '代理', id: 'AGENT' },
        { name: '商务', id: 'COMMERCIAL' }
      ]
    },
    {
      type: 'input',
      label: '姓名',
      rules: [
        { required: true, message: '姓名不能为空' }
      ],
      key: 'agentName',
      props: { placeholder: '请输入姓名' }
    },
    {
      type: 'input',
      label: '手机号',
      rules: [
        { required: true, message: '手机号不能为空' },
        { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
      ],
      key: 'accountNo',
      props: { placeholder: '请输入手机号' }
    },
    {
      type: 'input',
      label: '身份证号',
      rules: [
        { required: true, message: '身份证号不能为空' }
      ],
      key: 'cardNo',
      props: { placeholder: '请输入身份证号' }
    },
    {
      type: 'input',
      label: '登录密码',
      key: 'password',
      props: { placeholder: '请输入登录密码' }
    },
    {
      type: 'radio',
      label: '代理区域类型',
      key: 'agentAreaType',
      rules: [
        { required: true, message: '代理区域类型不能为空' }
      ],
      visible: { key: 'promoterAccountType', value: 'AGENT' },
      options: [
        { name: '省', id: 1 },
        { name: '市', id: 2 },
        { name: '区县', id: 3 }
      ]
    },
    {
      type: 'address',
      label: '区域地址',
      key: 'addressCodes',
      props: { level },
      visible: { key: 'promoterAccountType', value: 'AGENT' },
      rules: [
        { required: true, message: '区域地址不能为空' }
      ]
    },
    {
      type: 'select',
      label: '商务级别',
      key: 'managerLevel',
      rules: [
        { required: true, message: '商务级别不能为空' }
      ],
      visible: { key: 'promoterAccountType', value: 'COMMERCIAL' },
      options: managerLevelOptions
    },
    {
      type: 'remoteSearchSelect',
      label: '推荐人',
      props: {
        labelKey: 'agentName',
        clearable: true,
        initialValue: recommenderName,
        remoteMethod: (agentName: string) => useAxios().post('/default/local-manager/commercial-list', { agentName })
      },
      key: 'recommenderId',
      visible: { key: 'promoterAccountType', value: 'AGENT' }
    },
    {
      type: 'remoteSearchSelect',
      label: '发展人',
      props: {
        labelKey: 'agentName',
        clearable: true,
        initialValue: tutorName,
        remoteMethod: (agentName: string) => useAxios().post('/default/local-manager/commercial-list', { agentName })
      },
      key: 'tutorAccountId',
      visible: { key: 'promoterAccountType', value: 'COMMERCIAL' }
    },
    {
      type: 'input',
      label: '代理费',
      rules: [
        { required: true, message: '代理费不能为空' }
      ],
      key: 'agentMembershipFee',
      visible: { key: 'promoterAccountType', value: 'AGENT' },
      props: { placeholder: '请输入代理费', type: 'number' }
    },
    {
      type: 'input',
      label: '代理区域利润（%）',
      rules: [
        { required: true, message: '代理区域利润不能为空' }
      ],
      key: 'agentAreaRate',
      visible: { key: 'promoterAccountType', value: 'AGENT' },
      props: { placeholder: '请输入代理区域利润', type: 'number' }
    },
    {
      type: 'radio',
      label: '是否迁移团队',
      key: 'isTeam',
      rules: [
        { required: true, message: '代理区域类型不能为空' }
      ],
      visible: { key: 'promoterAccountType', value: 'COMMERCIAL' },
      options: [
        { name: '是', id: 1 },
        { name: '否', id: 2 }
      ]
    }
  ]
})

onMounted(() => GetList())

const GetList = async () => {
  try {
    loading.value = true
    const response: any = await useAxios().post('/default/local-manager/all-list', Query.value)
    loading.value = false
    items.value = response?.items || []
    total.value = response?.total || 0
  } catch (e) {
    loading.value = false
  }
}

const opener = (rows: any) => {
  if (rows) {
    Producer.value = cloneDeep(rows)
    Producer.visible = true
  } else {
    Producer.value = { promoterAccountType: 'COMMERCIAL', agentAreaType: null, addressCodes: [], recommenderName: '', tutorName: '' }
    Producer.visible = true
  }
  formKitRef.value?.clearValidate()
}

const submit = async () => {
  try {
    const validate = await formKitRef.value?.validate(true)
    if (validate) {
      Producer.loading = true
      const { addressCodes } = Producer.value, _address = ['agentProvinceCode', 'agentCityCode', 'agentAreaCode'];
      addressCodes.forEach((it: any, idx: number) => {
        (Producer.value as any)[_address[idx]] = it
      })
      if (Producer.value?.id) {
        await useAxios().put(`/default/local-manager/update/${Producer.value.id}`, Producer.value)
      } else {
        await useAxios().post('/default/local-manager', Producer.value)
      }
      Producer.loading = false
      await GetList()
      Producer.visible = false
    } else {
      Producer.loading = false
    }
  } catch (e) {
    Producer.loading = false
  }
}

const teamDialogOpener = async (row: any) => {
  const { id, agentName } = row || {};
  if (id) {
    Teams.visible = true
    Teams.name = agentName
    Teams.id = id || null
    await fetchTeam()
    Teams.level = [row]
  } else {
    Teams.visible = false
  }
}

const fetchTeam = async (target?: any) => {
  try {
    const { id, page } = Teams || {}
    Teams.loading = true
    const response: any = await useAxios().get('/default/local-manager/team-subordinates', {
      params: { managerId: target || id, page }
    })
    Teams.loading = false
    Teams.items = response?.items || []
    Teams.total = response?.total || 0
  } catch (error) {
    Teams.loading = false
  }
}

const fetchTargetTeam = (target: any) => {
  let targetID = null
  if (isNumber(target)) {
    const { id, agentName } = Teams.level[target] || {}
    targetID = id || null
    Teams.level.length = target + 1
    Teams.name = agentName
  } else {
    const { id, agentName } = target || {}
    targetID = id || null
    Teams.level.push(target)
    Teams.name = agentName
  }
  Teams.page = 1
  if (targetID) {
    Teams.id = targetID
    fetchTeam()
  }
}

const ListRemove = async (rows: any) => {
  try {
    if (rows?.id) {
      await ElMessageBox.confirm('确定要删除这个商务吗. 是否继续?', '删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      await useAxios().delete(`/default/local-manager/delete/${rows.id}`)
      await GetList()
    }
  } catch (e) {
    Producer.loading = false
  }
}
</script>

<template>
  <div class="flex align-center gap-[16px]">
    <FormKit
      :config="[
        {
          type: 'input',
          key: 'agentName',
          props: { placeholder: '请输入代理名称', style: { width: '130px' } }
        },
        {
          type: 'select',
          key: 'managerLevel',
          props: { placeholder: '请选择商务等级', style: { width: '150px' } },
          options: managerLevelOptions
        },
        {
          type: 'input',
          key: 'teamAgentName',
          props: { placeholder: '请输入团长名称', style: { width: '130px' } }
        }
      ]"
      columns="auto"
      v-model="Query">
      <template #append>
        <el-col :span="null">
          <el-button type="warning" @click="GetList()">搜索</el-button>
        </el-col>
        <el-col :span="null">
          <el-button type="warning" plain @click="opener(null)">新增商务</el-button>
        </el-col>
      </template>
    </FormKit>
  </div>

  <div class="min-h-[320px]" v-loading="loading">
    <el-table :data="items" stripe height="calc(100vh - 200px)">
      <el-table-column prop="id" label="ID" align="center" width="100" />
      <el-table-column prop="agentName" label="姓名" align="center" />
      <el-table-column prop="accountNo" label="账号" align="center" />
      <el-table-column prop="cardNo" label="身份证号" align="center" />
      <el-table-column prop="levelName" label="等级" align="center" />
      <el-table-column label="发展人" align="center">
        <template #default="{ row }">
          <span type="danger">{{ row.tutorName || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="归属团队" align="center" width="120">
        <template #default="{ row }">
          <span>{{ row.teamAgentName || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区域" align="center">
        <template #default="{ row }">
          <span type="danger">{{ row.agentAreaName || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="promoterAccountType" label="类型" align="center">
        <template #default="{ row }">
          <el-tag type="primary" v-if="row.promoterAccountType === 'AGENT'">代理</el-tag>
          <el-tag type="warning" v-else>商务</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="区域类型" align="center">
        <template #default="{ row }">
          <el-tag type="primary" v-if="row.agentAreaType === 1">省</el-tag>
          <el-tag type="success" v-else-if="row.agentAreaType === 2">市</el-tag>
          <el-tag type="warning" v-else-if="row.agentAreaType === 3">区县</el-tag>
          <span type="danger" v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="opener(row)">编辑</el-button>
          <el-button type="warning" link @click="teamDialogOpener(row)">团队</el-button>
          <el-button type="danger" link @click="ListRemove(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex justify-end mt-4">
      <el-pagination background v-model:current-page="Query.page" :page-sizes="[10, 20, 40, 100]"
        layout="total, sizes, prev, pager, next, jumper" @change="GetList()" :total="total"
        v-model:page-size="Query.limit" />
    </div>
  </div>

  <el-dialog v-model="Producer.visible" title="新增商务" :close-on-click-modal="false" width="500">
    <div class="max-h-[65vh] overflow-y-auto overflow-x-hidden">
      <FormKit v-model="Producer.value" :config="configs" ref="formKitRef" />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="Producer.visible = false">关闭</el-button>
        <el-button type="primary" :loading="Producer.loading" @click="submit()">确定</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="Teams.visible" :title="Teams.name ? `${Teams.name}的团队` : '查看团队'" :close-on-click-modal="false"
    width="520">
    <div v-loading="Teams.loading">
      <el-breadcrumb :separator-icon="ArrowRight" class="mb-4" v-if="Teams.level.length > 1">
        <el-breadcrumb-item class="cursor-pointer" v-for="(it, idx) in Teams.level" :key="idx"
          @click="fetchTargetTeam(idx)">
          {{ it.agentName || '未知姓名' }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <el-table :data="Teams.items" stripe height="60vh" empty-text="暂无团队数据">
        <el-table-column prop="id" label="ID" align="center" width="60" />
        <el-table-column prop="agentName" label="姓名" align="center" />
        <el-table-column prop="accountNo" label="账号" align="center" />
        <el-table-column prop="managerLevelName" label="等级" align="center" />
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="fetchTargetTeam(row)">查看下级</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end mt-4" v-if="Teams.total >= 15">
        <el-pagination background v-model:current-page="Query.page" layout="prev, pager, next" @change="fetchTeam()"
          :total="Teams.total" :page-size="Query.limit" />
      </div>
    </div>
  </el-dialog>
</template>

<route>
  { meta: { title: "用户管理" } }
</route>

<script setup lang="ts">
import FormKit from "@/components/FormKit/index.vue"
type FormKitInstance = InstanceType<typeof FormKit>
type dialogDataType = {
  visible: boolean;
  loading: boolean;
  saving?: boolean;
  id?: number | null;
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
    value: {}
  }),
  loading = ref(false);

onMounted(() => GetList())

const GetList = async () => {
  try {
    loading.value = true
    const response: any = await useAxios().get(`/account/users`, {
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
        const response: any = await useAxios().get(`/account/user/${id}`)
        dialogDataSet.value = response || {}
        setTimeout(() => {
            dialogDataSetFormRef.value?.clearValidate()
        }, 200)
    } catch (error) {
        console.log(String(error))
        dialogDataSet.visible = false
    } finally {
      dialogDataSet.loading = false
    }
  } else {
    dialogDataSet.id = null
    dialogDataSet.value = { state: 'NORMAL' }
    setTimeout(() => {
      dialogDataSetFormRef.value?.clearValidate()
    }, 200)
  }
}

const onSubmit = async () => {
  try {
    await dialogDataSetFormRef.value?.validate()
    dialogDataSet.saving = true
    if (dialogDataSet.id) {
      await useAxios().put(`/account/user/${dialogDataSet.id}`, dialogDataSet.value)
    } else {
      await useAxios().post(`/account/user`, dialogDataSet.value)
    }
    ElMessage.success('操作成功')
    dialogDataSet.visible = false
    GetList()
  } catch (error) {
    console.log(String(error))
  } finally {
    dialogDataSet.saving = false
  }
}

const remove = async (rows: any) => {
  try {
    if (rows?.id) {
      await ElMessageBox.confirm(`确定要删除${rows.nickName}这个用户吗. 是否继续?`, '删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      await useAxios().delete(`/account/user/${rows.id}`)
      await GetList()
    }
  } catch (e) {
    console.log(String(e))
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
            key: 'accountNo',
            props: { placeholder: '请输入用户账号' }
          },
          {
            type: 'select',
            key: 'state',
            props: { placeholder: '请选择用户状态', style: { width: '160px' }, clearable: true },
            options: [
              { name: '正常使用', id: 'NORMAL' },
              { name: '禁用', id: 'DISABLED' }
            ]
          }
        ]"
        columns="auto"
        v-model="filterQuery">
        <template #append>
          <el-col :span="null">
            <el-button type="warning" @click="GetList()">搜索</el-button>
          </el-col>
          <el-col :span="null">
            <el-button type="primary" @click="opener(null)">新增用户</el-button>
          </el-col>
        </template>
      </FormKit>
    </div>
  </div>
  <div class="min-h-[320px]" v-loading="loading">
    <el-table :data="items" stripe>
      <el-table-column prop="id" label="ID" align="center" width="60" />
      <el-table-column label="头像" align="center" width="100">
        <template #default="{ row }">
          <el-image
            :src="row.avatar"
            v-if="row.avatar"
            :zoom-rate="1.2"
            class="w-[50px] h-[50px] rounded-[50%]"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="[row.avatar]"
            preview-teleported
            show-progress
            fit="cover"
          />
          <span v-else>暂未设置</span>
        </template>
      </el-table-column>
      <el-table-column prop="nickName" label="用户名称" align="center" />
      <el-table-column prop="accountNo" label="账号" align="center" />
      <el-table-column label="状态" align="center">
        <template #default="{ row }">
          <el-tag type="primary" v-if="row.state === 'NORMAL'">正常</el-tag>
          <el-tag type="warning" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template #default="{ row }">
          <span>{{ row.createdTime || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center">
        <template #default="{ row }">
          <span>{{ row.updatedTime || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template #default="{ row }">
          <div class="flex justify-center align-center">
            <el-button type="primary" link @click="opener(row.id)" :disabled="row.superAccounts.indexOf(row.accountNo) >= 0">编辑</el-button>
            <el-button type="danger" link @click="remove(row)" :disabled="row.superAccounts.indexOf(row.accountNo) >= 0" v-if="Array.isArray(row.superAccounts)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex justify-end mt-4" v-if="total >= filterQuery.limit">
      <el-pagination background v-model:current-page="filterQuery.page" layout="prev, pager, next" @change="GetList()" :total="total" :page-size="filterQuery.limit" />
    </div>
  </div>

  <el-dialog v-model="dialogDataSet.visible" :title="dialogDataSet.id ? '编辑用户' : '创建用户'" :close-on-click-modal="false" width="420">
    <FormKit
      v-loading="dialogDataSet.loading"
      :config="[
        {
          type: 'upload',
          label: '用户头像',
          key: 'avatar',
          props: { limite: 1 }
        },
        {
          type: 'input',
          label: '昵称',
          key: 'nickName',
          props: { placeholder: '请输入昵称' },
          rules: [
            { required: true, message: '昵称不能为空' }
          ]
        },
        {
          type: 'input',
          label: '账号',
          key: 'accountNo',
          props: { placeholder: '请输入账号' },
          rules: [
            { required: true, message: '账号不能为空' }
          ]
        },
        {
          type: 'input',
          label: '密码',
          key: 'password',
          props: { placeholder: '请输入密码' },
          rules: [
            { required: true, message: '密码不能为空' }
          ]
        },
        {
          type: 'select',
          label: '用户角色',
          key: 'roleIds',
          span: 24,
          props: {
            placeholder: '请选择用户角色',
            clearable: true,
            collapseTags: true,
            collapseTagsTooltip: true,
            maxCollapseTags: 3,
            multiple: true
          },
          request: () => useAxios().get('/account/all-roles'),
          handle: (response: any) => (response || []),
          rules: [
            { required: true, message: '用户角色不能为空' }
          ]
        },
        {
          type: 'radio',
          label: '状态',
          key: 'state',
          span: 24,
          options: [
            { name: '启用', id: 'NORMAL' },
            { name: '禁用', id: 'DISABLED' }
          ]
        }
      ]"
      :columns="2"
      v-model="dialogDataSet.value"
      ref="dialogDataSetFormRef" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogDataSet.visible = false">关闭</el-button>
        <el-button type="primary" :loading="dialogDataSet.saving" @click="onSubmit" :disabled="dialogDataSet.loading">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>
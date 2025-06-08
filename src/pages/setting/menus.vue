<route>
  { meta: { title: "菜单管理" } }
</route>

<script setup lang="ts">
import FormKit from "@/components/FormKit/index.vue"
import { useUserStoreHook } from "@/store/modules/user"

type FormKitInstance = InstanceType<typeof FormKit>
type dialogDataType = {
  visible: boolean;
  loading: boolean;
  saving?: boolean;
  id?: number | null;
  value: any;
}

const userStore = useUserStoreHook()

const filterQuery = ref({
    page: 1,
    limit: 10
  }),
  dialogDataSetFormRef = ref<FormKitInstance>(),
  items: any = ref([]),
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
    const response: any = await useAxios().get(`/user/menus`, {
      params: filterQuery.value
    })
    loading.value = false
    items.value = response || []
  } catch (e) {
    loading.value = false
  }
}

const opener = async (id: number | null, parentId?:any) => {
  dialogDataSet.visible = true
  delete dialogDataSet.id
  if (id) {
    dialogDataSet.id = id
    try {
      dialogDataSet.loading = true
      const response: any = await useAxios().get(`/user/searchMenu`, { params: { id } })
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
    dialogDataSet.value = { type: 'MENU', sort: 1, parentId: parentId || 0 }
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
      await useAxios().put(`/account/menu/${dialogDataSet.id}`, dialogDataSet.value)
    } else {
      await useAxios().post(`/account/menu`, dialogDataSet.value)
    }
    ElMessage.success('操作成功')
    await userStore.getUserInfo()
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
      await ElMessageBox.confirm(`确定要删除${rows.name}这个菜单吗. 是否继续?`, '删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      await useAxios().delete(`/account/menu/${rows.id}`)
      await userStore.getUserInfo()
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
            key: 'shopName',
            props: { placeholder: '请输入菜单名称' }
          }
        ]"
        columns="auto"
        v-model="filterQuery">
        <template #append>
          <el-col :span="null">
            <el-button type="warning" @click="GetList()">搜索</el-button>
          </el-col>
          <el-col :span="null">
            <el-button type="primary" @click="opener(null)">新增菜单</el-button>
          </el-col>
        </template>
      </FormKit>
    </div>
  </div>
  <div class="min-h-[320px]" v-loading="loading">
    <el-table :data="items" stripe>
      <el-table-column type="expand" width="40">
        <template #default="{ row }">
          <div class="py-2 pl-[40px]">
            <el-table :data="row.children" :show-header="false" empty-text="暂无子菜单">
              <el-table-column prop="name" label="菜单名称" align="center" />
              <el-table-column prop="sort" label="排序" align="center" />
              <el-table-column label="图标" align="center" width="100">
                <template #default="{ row }">
                  <el-image
                    :src="row.icon"
                    v-if="row.icon"
                    :zoom-rate="1.2"
                    class="w-[50px] h-[50px] rounded-[50%]"
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="[row.icon]"
                    preview-teleported
                    show-progress
                    fit="cover"
                  />
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column prop="path" label="地址" align="center" />
              <el-table-column prop="code" label="菜单编码" align="center" />
              <el-table-column label="菜单类型" align="center">
                <template #default="{ row }">
                  <el-tag type="warning" v-if="row.type === 'LINK'">链接</el-tag>
                  <el-tag type="primary" v-if="row.type === 'MENU'">内部菜单</el-tag>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template #default="{ row }">
                  <div class="flex justify-center align-center">
                    <el-button type="primary" link @click="opener(row.id)">编辑</el-button>
                    <el-button type="danger" link @click="remove(row)">删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="菜单名称" align="center" />
      <el-table-column prop="sort" label="排序" align="center" />
      <el-table-column label="图标" align="center" width="100">
        <template #default="{ row }">
          <el-image
            :src="row.icon"
            v-if="row.icon"
            :zoom-rate="1.2"
            class="w-[50px] h-[50px] rounded-[50%]"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="[row.icon]"
            preview-teleported
            show-progress
            fit="cover"
          />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="地址" align="center" />
      <el-table-column prop="code" label="菜单编码" align="center" />
      <el-table-column label="菜单类型" align="center">
        <template #default="{ row }">
          <el-tag type="warning" v-if="row.type === 'LINK'">链接</el-tag>
          <el-tag type="primary" v-if="row.type === 'MENU'">内部菜单</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="170">
        <template #default="{ row }">
          <div class="flex justify-center align-center">
            <el-button type="primary" link @click="opener(0, row.id)">编辑</el-button>
            <el-button type="primary" link @click="opener(null, row.id)">新增子菜单</el-button>
            <el-button type="danger" link @click="remove(row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="dialogDataSet.visible" :title="dialogDataSet.id ? '编辑菜单' : '创建菜单'" :close-on-click-modal="false" width="520">
    <FormKit
      v-loading="dialogDataSet.loading"
      :config="[
        {
          label: '上级菜单',
          type: 'select',
          key: 'parentId',
          options: [{ name: '顶级菜单', id: 0 }, ...items],
          disabled: loading,
          props: { placeholder: '请选择上级菜单' },
          rules: [
            { required: true, message: '菜单类型不能为空' }
          ]
        },
        {
          type: 'input',
          label: '菜单名称',
          key: 'name',
          props: { placeholder: '请输入菜单名称' },
          rules: [
            { required: true, message: '菜单名称不能为空' }
          ]
        },
        {
          type: 'input',
          label: '菜单地址',
          key: 'path',
          props: { placeholder: '请输入菜单地址' },
          rules: [
            { required: true, message: '菜单地址不能为空' }
          ]
        },
        {
          label: '菜单类型',
          type: 'select',
          key: 'type',
          options: [
            { name: '链接', id: 'LINK' },
            { name: '内部菜单', id: 'MENU' }
          ],
          rules: [
            { required: true, message: '菜单类型不能为空' }
          ]
        },
        {
          type: 'inputNumber',
          label: '排序',
          hint: '数字越大越靠前',
          span: 24,
          key: 'sort',
          props: { placeholder: '请输入排序', min: 0, max: 10, step: 1, controlsPosition: 'right' }
        },
        {
          type: 'upload',
          label: '菜单图标',
          key: 'icon',
          props: { limite: 1 }
        }
      ]"
      :columns="2"
      v-model="dialogDataSet.value"
      ref="dialogDataSetFormRef" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogDataSet.visible = false">关闭</el-button>
        <el-button type="primary" :loading="dialogDataSet.loading" @click="onSubmit">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>
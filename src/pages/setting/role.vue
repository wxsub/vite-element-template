<route>
  { meta: { title: "角色管理" } }
</route>

<script setup lang="ts">
import { ElLoading } from 'element-plus'
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
  menus = reactive({
    items: [],
    loading: false
  }),
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
    const response: any = await useAxios().get(`/user/roles`, {
      params: filterQuery.value
    })
    items.value = response?.items || []
    total.value = response?.total || 0
  } catch (e) {
    console.log(String(e))
  } finally {
    loading.value = false
    fetchMenus()
  }
}

const fetchMenus = async () => {
  try {
    menus.loading = true
    const response: any = await useAxios().get(`/user/menus`, {
      params: filterQuery.value
    })
    menus.loading = false
    menus.items = response || []
  } catch (e) {
    console.log(String(e))
  } finally {
    menus.loading = false
  }
}

const opener = async () => {
  dialogDataSet.visible = true
}
</script>

<template>
  <div class="flex align-center gap-[16px]">
    <div class="flex align-center">
      <FormKit
        :config="[
          {
            type: 'input',
            key: 'name',
            props: { placeholder: '请输入角色名称' }
          }
        ]"
        columns="auto"
        v-model="filterQuery">
        <template #append>
          <el-col :span="null">
            <el-button type="warning" @click="GetList()">搜索</el-button>
          </el-col>
          <el-col :span="null">
            <el-button type="primary" @click="opener()">新增角色</el-button>
          </el-col>
        </template>
      </FormKit>
    </div>
  </div>
  <div class="min-h-[320px]" v-loading="loading">
    <el-table :data="items" stripe>
      <el-table-column prop="id" label="ID" align="center" width="60" />
      <el-table-column prop="name" label="角色名称" align="center" />
      <el-table-column prop="description" label="描述" align="center" />
    </el-table>

    <div class="flex justify-end mt-4" v-if="total >= filterQuery.limit">
      <el-pagination background v-model:current-page="filterQuery.page" layout="prev, pager, next" @change="GetList()" :total="total" :page-size="filterQuery.limit" />
    </div>
  </div>

  <el-dialog v-model="dialogDataSet.visible" :title="dialogDataSet.id ? '编辑角色' : '创建角色'" :close-on-click-modal="false" width="420">
    <FormKit
      v-loading="dialogDataSet.loading"
      :config="[
        {
          type: 'input',
          label: '角色名称',
          key: 'name',
          props: { placeholder: '请输入角色名称' },
          rules: [
            { required: true, message: '角色名称不能为空' }
          ]
        },
        {
          type: 'input',
          label: '唯一编码',
          key: 'code',
          props: { placeholder: '请输入唯一编码' },
          rules: [
            { required: true, message: '唯一编码不能为空' }
          ]
        },
        {
          label: '菜单',
          key: 'menuIds',
          rules: [
            { required: true, message: '菜单不能为空' }
          ]
        }
      ]"
      v-model="dialogDataSet.value"
      ref="dialogDataSetFormRef">
      <template #menuIds>
        <el-tree-select
          v-model="dialogDataSet.value.menuIds"
          :data="menus.items"
          v-if="Array.isArray(menus.items) && menus.items.length > 0"
          show-checkbox
          check-strictly
          :multiple="true"
          node-key="id"
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="3"
          :props="{ label: 'name', value: 'id', children: 'children' }"
          :loading="menus.loading"
          :render-after-expand="false"
          style="width: 100%"
        />
        <span v-else class="text-[#bbb]">菜单树加载失败</span>
      </template>
    </FormKit>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogDataSet.visible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<route>{ meta: { title: "通讯录", layout: 'IM' } }</route>

<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import contact from "@/assets/styles/modules/contact.module.scss"
import Items from "@/components/business/contact/items.vue"
import http from "@/config/axios.config"
let loading = ref(false)

const remote = reactive<any>([])

async function GetList(id: number | undefined, depIdx: number = 0) {
  try {
    loading.value = true
    console.log(depIdx)
    const response: any = id ? await http.post(`addressBook/getDepartmentPersonnelList`, {
      departId: id
    }) : await http.post(`addressBook/getCompanyPersonnelList`)
    loading.value = false
    if (response?.code === 200 && response?.data) {
      const rxd = response.data
      if (rxd?.['get_department'].length === 0 && rxd?.['get_employ'].length === 0) return
      if (id) {
        remote[depIdx + 1] = response.data
      } else {
        remote.push(response.data)
      }
    }
  } catch (error: any) {
    loading.value = false
  }
}

GetList(undefined)
</script>

<template>
  <div class="h-full flex flex-col">
    <div :class="contact.header">
      <span>组织架构</span>
      <el-button color="#3370ff" plain>
        添加企业成员
      </el-button>
    </div>
    <div :class="contact.main" class="flex-1">
      <div :class="contact.organizationDepartments">
        <el-empty description="组织架构空空如也~" v-if="remote.length === 0" class="mx-auto" />
        <div :class="contact.departments" v-for="(dep, depIdx) in remote" :key="depIdx">
          <div
            v-for="(department, departmentIdx) in dep['get_department']"
            :key="`${depIdx}-${departmentIdx}`"
            @click="GetList(department.depart_id, depIdx); dep.activeId = department.id"
            :class="[contact.departmentsItem, { [contact.departmentsActive]: dep.activeId === department.id }]">
            <span>{{ department['name'] || '未命名部门' }}</span>
            <el-icon><ArrowRight /></el-icon>
          </div>
          <items
            :name="employ.full_name"
            :src="employ.head_sculpture"
            v-for="(employ, employIdx) in dep['get_employ']"
            :key="`${depIdx}-${employIdx}`" />
        </div>
      </div>
    </div>
  </div>
</template>

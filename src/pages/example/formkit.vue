<route>
    {
      meta: { title: "FormKit组件" }
    }
</route>

<template>
    <div>
        <h1>FormKit组件</h1>
        <FormKit v-model="values" :config="configs" :columns="2" :block="true" />
        <code>
            {{  values  }}
        </code>
    </div>
</template>

<script setup lang="ts">
import FormKit from '@/components/FormKit/index.vue'

const values = reactive({}),
    configs = reactive([
        {
            type: 'input',
            key: 'name',
            label: '姓名'
        },
        {
            type: 'input',
            key: 'age',
            label: '年龄'
        },
        {
            type: 'input',
            key: 'address',
            label: '地址'
        }
    ]);
</script>
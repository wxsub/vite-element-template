<script setup lang="ts">
const props = defineProps({
  labelKey: { type: String, default: 'name' },
  valueKey: { type: String, default: 'id' },
  initialValue: { default: null },
  placeholder: { type: String, default: '请输入' },
  modelValue: { type: [String, Number, Array] },
  remoteMethod: { type: [Function, null], default: null }
})

const emit = defineEmits(['update:modelValue']),
  options = ref<any>([]),
  loading = ref<boolean>(false);

const dataset: any = computed({
    get: () => {
      return props.modelValue || null
    },
    set: (value) => {
      emit('update:modelValue', value)
    }
})

onMounted(() => {
  if (props.initialValue) searchRemoteMethod(props.initialValue)
})

const searchRemoteMethod = async (query: string) => {
  if (query && props.remoteMethod) {
    loading.value = true
    const response = await props.remoteMethod(query)
    loading.value = false
    if (Array.isArray(response)) options.value = response
  } else {
    options.value = []
  }
}
</script>

<template>
  <el-select
    v-model="dataset"
    filterable
    remote
    reserve-keyword
    :placeholder="placeholder"
    :remote-method="searchRemoteMethod"
    :loading="loading"
    v-bind="$attrs">
    <el-option
      v-for="(it, idx) in options"
      :key="idx"
      :label="it[labelKey]"
      :value="it[valueKey]"
    />
  </el-select>
</template>

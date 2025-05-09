<template>
  <el-radio-group v-model="_value" v-bind="$attrs">
    <el-radio
        v-for="(it, idx) in options"
        :value="it[$attrs.valueKey || 'id']"
        :key="idx">
      {{ it[$attrs.labelKey || 'name'] }}
    </el-radio>
  </el-radio-group>
</template>

<script>
export default {
  name: 'FormKitRadio',
  model: { prop: 'value', event: 'change' },
  props: {
    value: { default: null },
    options: { type: Array, default: () => [] }
  },
  computed: {
    _value: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('change', newVal)
      }
    }
  }
}
</script>

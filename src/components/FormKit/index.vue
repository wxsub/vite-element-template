<template>
  <div :class="[{ 'form-label-auto': isAutoAlignment }]" class="FormKit">
    <el-form
      :ref="UNIQUE_KEY"
      :model="modelValue"
      :key="UNIQUE_KEY"
      v-bind="FORM_ATTRS"
      :label-position="labelPosition">
      <el-row
        v-bind="row"
        :style="{ 'row-gap': `${rowGap}px` }"
        :class="[isAutoAlignment ? 'form-kit-auto' : FormKit['form-kit-row']]">
        <el-col
          v-for="conf in configs"
          :key="conf.key"
          :span="conf.span || COL_SPAN">
          <el-form-item
            :label="conf.label"
            :label-width="isAutoAlignment ? '0px' : (conf.labelWidth || `${labelWidth}px`)"
            :prop="conf.key"
            :rules="conf.rules">
            <component
                v-if="conf.type"
                :is="loader(conf.type)"
                :ref="`formKit-component-${conf.key}`"
                :disabled="conf['disabled']"
                v-model="modelValue[conf.key]"
                :options="conf.options || buckets[conf.key]"
                :class="{ [FormKit['item-hint']]: !(block) }"
                v-on="conf.events || {}"
                v-bind="conf.props"
                @change="mutation($event, conf)">
              <template #prefix v-if="conf?.prefix">
                <el-image :src="conf.prefix" class="h-6 mt-1" />
              </template>
            </component>
            <slot :name="conf.key" :row="conf" :value="modelValue[conf.key]" :size="size" />
            <p v-if="conf.hint" :class="FormKit['item-hint']" v-html="conf.hint"/>
          </el-form-item>
        </el-col>
        <slot name="FormKitAppend" />
      </el-row>
    </el-form>
    <slot :config="configs" name="FormKitContent" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import approved, { Modules } from './asyncLoadModules'
import type { FormRules } from 'element-plus'
import _ from 'lodash'
interface ConfigInterface {
  type: string;
  key: string;
  span?: number;
  block?: boolean;
  labelWidth?: number;
  label?: string;
  prefix?: string;
  disabled?: boolean;
  visible?: boolean | object | Array<object>;
  hint?: string;
  options?: Array<object>;
  rules?: Array<FormRules>;
  events?: object;
  props?: object;
  request?: Function | object;
}
let CurrentInstance: any = null

const UNIQUE_KEY = ref(Number(new Date())),
	  Stacks: Array<object> = reactive([]),
    emits = defineEmits(["update:modelValue", "update:config", "update", "enter"]);
const props = defineProps({
  modelValue: { required: true, type: Object },
  config: { type: Array<ConfigInterface>, default: () => [] },
  rules: { type: Object, default: () => {} },
  block: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  labelPosition: { type: String, default: 'top' }, // Form Input Alignment Rules
  rowGap: { type: Number, default: 5 }, // Vertical spacing of form items
  labelWidth: { type: Number, default: 120 }, // Form item title width (only works when labelPosition is left, right)
  columns: { type: [Number, String], default: 1 }, // How many columns per row
  size: { type: String, default: 'default' }, // Form Size
  row: { type: Object, default: () => ({ gutter: 30, type: 'flex' }) } // Form row item settings
})

onMounted(async () => {
  try {
    for (const iterator of props.config) {
      if (iterator?.request) Stacks.push(iterator)
    }
    if (Stacks.length > 0) await executeRequestStack()
    CurrentInstance = getCurrentInstance()
  } catch (error) {
	  console.log(`[_initComponent method]: ${error}`)
  }
})

const FORM_ATTRS = computed(() => {
  const attrs = Object.create(null);
  attrs.size = props.size;
  attrs.inline = typeof props.columns === "number" && props.columns > 1;
  if (props.disabled) attrs.disabled = props.disabled;
  if (props.rules && Object.keys(props.rules).length > 0) attrs.rules = props.rules;
  return attrs
}), isAutoAlignment = computed(() => {
  return props.columns === 'auto' && props.labelPosition !== 'top'
}), COL_SPAN = computed(() => {
  if (typeof props.columns === "number") return 24 / props.columns
}), configs: ComputedRef<ConfigInterface[]> = computed(() => {
  return props.config.filter((conf: ConfigInterface) => {
    if (conf?.visible === undefined) return conf
    if (_.isObject(conf.visible) || _.isArray(conf.visible)) {
      fixedPointClearValidate(conf)
      if (_.isObject(conf.visible) && checkConfigIsVisible(conf.visible)) return conf
      if (_.isArray(conf.visible)) {
        const _visible = conf.visible
        const isCheck = _visible.some((it: Object) => { return checkConfigIsVisible(it) })
        if (isCheck) return conf
      }
    } else if (_.isBoolean(conf.visible)) {
      if (conf.visible) return conf
    } else {
      console.warn('visible field has been set, but it is not an [array, object, Boolean]!')
      return conf
    }
  })
});

const buckets: any = reactive({})

function loader(type: string) {
  try {
    if (approved.includes(type)) {
      return Modules[type]
    } else {
      return defineComponent({
        template: `<p>can not find module for ${String(type)}</p>`
      })
    }
  } catch (e) {
    return defineAsyncComponent(async () => {
      return {
        template: `<h5>${String(type)} load faild!</h5><p>reson: ${e}</p>`
      }
    })
  }
}
function mutation(event: any, config: ConfigInterface) {
  emits('update', { event, config })
  fixedPointClearValidate(config)
}
function fixedPointClearValidate(config: ConfigInterface) {
  if (Object.hasOwnProperty.call(config, 'key') && Object.hasOwnProperty.call(config, 'rules')) {
    const { proxy } = CurrentInstance || {}
    if (proxy) proxy.$refs[UNIQUE_KEY.value].clearValidate([config.key])
  }
}
function checkConfigIsVisible({ value, key }: any) {
  if (key && value === undefined) {
    if (props.modelValue[key]) return true
  } else if (value === undefined && key === undefined) {
    console.warn('Key and value field not detected, U can like this: { value, key } or { key }')
  } else {
    if (props.modelValue[key] === value) return true
  }
  return false
}
async function executeRequestStack() {
  const runner: IterableIterator<any> = Stacks[Symbol.iterator]()
  for (const iterator of runner) {
	  try {
      const { request, key, handle } = iterator,
        response = Object.prototype.toString.call(request) === '[object Function]' ? await request() : await request;
      if (_.isFunction(handle)) {
        buckets[key] = handle(response)
      } else {
        const { data = [], code } = response || {}
        if (code === 200) buckets[key] = data
      }
    } catch (e) {
      console.log(`FormKit executeRequestStack failed: ${e}`)
	  }
  }
}
function validate(openTips = false) {
  return new Promise((resolve, reject) => {
    try {
	    if (CurrentInstance) {
        const { proxy } = CurrentInstance
		    proxy.$refs[UNIQUE_KEY.value].validate((valid: boolean) => {
          if (valid) {
            resolve(props.modelValue)
          } else throw '您需要将标星号的栏目填写完整后重新尝试'
        })
      } else {
		    console.warn("组件加载未完成")
      }
    } catch (e: any) {
      if (openTips) ElMessage.error(e)
      reject(e)
    }
  })
}
</script>

<style module="FormKit" lang="scss">
.form-kit-row { flex-wrap: wrap }
.item-hint { margin: 0; color: #888888; font-weight: 300; font-size: 12px; line-height: 24px }
.formKit-list-item { display: inline-block; width: 100% }
</style>

<style lang="scss">
.FormKit {
  .el-input-number { width: auto }
  :deep(.el-form-item) { margin: 0; width: 100% }
  :deep(.el-form--label-top .el-form-item__label) { padding: 0 }
  :deep(.el-form-item__error) { position: relative }
}
.form-label-auto :deep(.el-form-item__label) { width: auto !important }
.form-kit-auto :deep(.el-form-item__content) { display: inline-block }
</style>

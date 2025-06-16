import { ElInput, ElDatePicker, ElRate, ElTimePicker, ElTimeSelect, ElCascader } from "element-plus"

export const Modules: any = {
  select: defineAsyncComponent(() => import("./modules/select.vue")),
  remoteSearchSelect: defineAsyncComponent(() => import("./modules/remoteSearchSelect.vue")),
  address: defineAsyncComponent(() => import("./modules/address.vue")),
  checkbox: defineAsyncComponent(() => import("./modules/checkbox.vue")),
  radio: defineAsyncComponent(() => import("./modules/radio.vue")),
  popover: defineAsyncComponent(() => import("./modules/popover.vue")),
  dropdown: defineAsyncComponent(() => import("./modules/dropdown.vue")),
  inputNumber: defineAsyncComponent(() => import("./modules/inputNumber.vue")),
  upload: defineAsyncComponent(() => import("./modules/upload.vue")),
  editor: defineAsyncComponent(() => import("./modules/Editor/index.vue")),
  input: ElInput,
  datePicker: ElDatePicker,
  timePicker: ElTimePicker,
  timeSelect: ElTimeSelect,
  cascader: ElCascader,
  rate: ElRate
}

const components: Array<string> = Object.keys(Modules)

export default components

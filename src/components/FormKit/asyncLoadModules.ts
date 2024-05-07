import { ElInput, ElDatePicker, ElInputNumber, ElRate, ElTimePicker, ElTimeSelect } from "element-plus"

export const Modules: any = {
  select: defineAsyncComponent(() => import("./modules/select.vue")),
  checkbox: defineAsyncComponent(() => import("./modules/checkbox.vue")),
  radio: defineAsyncComponent(() => import("./modules/radio.vue")),
  popover: defineAsyncComponent(() => import("./modules/popover.vue")),
  dropdown: defineAsyncComponent(() => import("./modules/dropdown.vue")),
  // singleImageUpload: defineAsyncComponent(() => import("./modules/singleImageUpload.vue")),
  input: ElInput,
  datePicker: ElDatePicker,
  timePicker: ElTimePicker,
  timeSelect: ElTimeSelect,
  inputNumber: ElInputNumber,
  rate: ElRate
}

const components: Array<string> = Object.keys(Modules)

export default components

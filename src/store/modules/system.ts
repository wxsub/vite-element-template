import { defineStore } from "pinia"
import { ref } from "vue"

export const useSystemStore = defineStore("system", () => {
  const stream = ref([])

  const setStream = (data: Array<object> | any) => stream.value = data

  return { stream, setStream }
})

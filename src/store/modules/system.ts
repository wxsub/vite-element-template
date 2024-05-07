import { defineStore } from "pinia"

export const useSystemStore = defineStore("system", () => {
  const buckets = reactive(Object.create(null))

  return { buckets }
})

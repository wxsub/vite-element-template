import { defineStore } from "pinia"
import { store } from "@/store"
import { useUserStore } from "@/store/modules/user"

const { companyName } = useUserStore().user.data

export const useContactStore = defineStore("contact", () => {
  const MenuList: any = reactive([
    { type: 'menu', title: "外部联系人", icon: "contact-ico-2.png", key: 'external' },
    { type: 'menu', title: "新的联系人", icon: "contact-ico-3.png", key: 'new' },
    { type: 'menu', title: "我的群组", icon: "contact-ico-4.png", key: 'group' }
  ])

  if (companyName) {
    MenuList.unshift({ type: 'divider' })
    MenuList.unshift({ type: 'menu', title: "组织架构", icon: "contact-ico-1.png", key: 'department' })
  }

  return { MenuList }
})

export function useContactStoreHook() {
  return useContactStore(store)
}

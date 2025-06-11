import { defineStore } from "pinia"
import http from "@/config/axios.config"
import { store } from "@/store"
import { useStorage } from "@vueuse/core"
import { ref } from "vue"

export const useUserStore = defineStore("user", () => {
  const Dataset: any = ref(null),
    MenuCursorSet = new Set();

  const setUserData = (data: Object | any) => Dataset.value = data

  /**
   * 密码登录
   * @param loginData
   */
  function login(loginData: object) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const response: any = await useAxios().post("/login", loginData)
        if (response?.token) {
          useStorage<string>("XSRF-TOKEN", response.token)
          resolve(response)
        } else reject(response)
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  }

  function getUserInfo(reload: boolean = true) {
    return new Promise<any>(async (resolve, reject) => {
      try {
        if (Dataset?.value || reload === false) {
          resolve(Dataset.value)
        } else {
          const response: any = await http.get("/user/info");
          if (response?.id) {
            setUserData(response);
            setMenuCursor(response.menus || [])
            resolve(response);
          } else {
            reject(response);
          }
        }
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  }

  async function logout() {
    try {
      await ElMessageBox.confirm(
        '确认退出登录吗? 退出后如需使用您将需要重新登录',
        '退出登录',
        {
          confirmButtonText: '继续退出',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      const hash = window.location.hash
      localStorage.clear()
      if (hash.indexOf("#/login") === -1) location.reload()
    } catch (e) {
      console.log(e)
    }
  }

  const setMenuCursor = (menus: [any]) => {
    MenuCursorSet.add("/")
    const traverse = (nodes: [any]) => {
      nodes.forEach(node => {
        if (node.path?.trim()) MenuCursorSet.add(node.path.trim())
        if (node.children) traverse(node.children)
      })
    }
    if (menus.length > 0) traverse(menus)
  }

  return {
    Dataset,
    login,
    getUserInfo,
    logout,
    setUserData,
    hasMenuCursor: (targetPath: string) => MenuCursorSet.has(targetPath.trim())
  }
})

export function useUserStoreHook() {
  return useUserStore(store)
}

import { defineStore } from "pinia"
import http from "@/config/axios.config"
import { store } from "@/store"
import { useStorage } from "@vueuse/core"
import { ref } from "vue"

export const useUserStore = defineStore("user", () => {
  const Dataset: any = ref(null)

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

  function getUserInfo() {
    return new Promise<any>(async (resolve, reject) => {
      try {
        if (Dataset?.value) {
          resolve(Dataset.value)
        } else {
          const response: any = await http.get("/user/info");
          if (response?.id) {
            setUserData(response);
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

  return {
    Dataset,
    login,
    getUserInfo,
    logout,
    setUserData
  }
})

export function useUserStoreHook() {
  return useUserStore(store)
}

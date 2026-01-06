import { defineStore } from "pinia"
import { store } from "@/store"
import { useStorage } from "@vueuse/core"
import { ref } from "vue"

export const useUserStore = defineStore("user", () => {
  const UserData: any = ref({});

  /**
   * user login
   * @param loginData
   */
  function login(loginData: object) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const response: any = await useAxios().get("/mock/login.json")
        if (response?.token) {
          useStorage<string>("XSRF-TOKEN", response.token)
          resolve(response)
        } else {
          reject(response)
        }
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  }

  function getUserInfo(reload: boolean = true) {
    return new Promise<any>(async (resolve, reject) => {
      try {
        if (UserData.value?.id || reload === false) {
          resolve(UserData.value)
        } else {
          const response: any = await useAxios().get("/mock/user.json");
          if (response?.id) {
            UserData.value = response;
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
    UserData,
    login,
    getUserInfo,
    logout
  }
})

export function useUserStoreHook() {
  return useUserStore(store)
}


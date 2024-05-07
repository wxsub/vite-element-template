import { defineStore } from "pinia"
import http from "@/config/axios.config"
import { store } from "@/store"
import { isEmpty } from "lodash"

export const useUserStore = defineStore("user", () => {
  const user: any = reactive(Object.create(null)),
    bucket: any = reactive(Object.create(null));

  /**
   * 密码登录
   * @param loginData
   */
  function login(loginData: object) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const response: any = await http.post("index/login/password", loginData),
            { code } = response || {};
        if (code === 200) {
          resolve(response)
        } else reject(response)
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  }

  /**
   * 手机号验证码登录
   * @param loginData
   */
  function VerificationCodeLogin(loginData: object) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const response: any = await http.post("index/login/verifyCode", loginData),
          { code } = response || {};
        if (code === 200) {
          resolve(response)
        } else reject(response)
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  }

  /**
   * 用户注册
   * @param registerData
   */
  function register(registerData: object) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const response: any = await http.post("index/register", registerData),
          { code } = response || {};
        if (code === 200) {
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
        if (user?.data) { resolve(user.data) } else {
          const response: any = await http.post("user/userinfo"),
            { code, data = {} } = response || {};
          if (code === 200) {
            if (data?.info) user.data = data.info
            if (data?.table) user.companyList = data.table
            resolve(data)
          } else reject(response)
        }
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  }

  // 注销
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

  /**
   * 用户选择公司
   * @param userid 用户id
   * @param temporaryToken 登录时用户的临时token
   */
  function selectEnterprise(userid: string, temporaryToken: string) {
    return new Promise( async (resolve, reject) => {
      try {
        const response: any = await http.post(`index/selectUserRole`, { userid, temporaryToken })
        resolve(response)
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * 切换用户身份
   * @param userid 用户id
   */
  function changeRoles(userid: string) {
    return new Promise( async (resolve, reject) => {
      try {
        if (isEmpty(userid)) throw `can not found userid: ${userid}`
        const response: any = await http.post(`user/selectUserRoleList`, { userid })
        if (response?.code === 200) {
          resolve(response)
          ElMessage.success("切换成功")
          setTimeout(() => { window.location.reload() }, 1000)
        } else throw response
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * 获取验证码
   * @param parameter
   * @param scenes 场景
   */
  function getMsgCode(parameter: object, scenes: String) {
    return new Promise( async (resolve, reject) => {
      try {
        const response: any = await http.post(`index/textMessage/${scenes}`, parameter)
        resolve(response)
      } catch (e) {
        reject(e)
      }
    })
  }

  return {
    user,
    bucket,
    login,
    getUserInfo,
    logout,
    getMsgCode,
    VerificationCodeLogin,
    register,
    changeRoles,
    selectEnterprise
  }
})

export function useUserStoreHook() {
  return useUserStore(store)
}

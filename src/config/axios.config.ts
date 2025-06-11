import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios"
import { useStorage } from "@vueuse/core"
import { ElMessage } from "element-plus"

// Create an axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 20000,
  withCredentials: true
});

// request interceptor
service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers['Authori-Zation'] = useStorage<string>("XSRF-TOKEN", null).value
  return config
}, (error: any) => Promise.reject(error))

// response interceptor
service.interceptors.response.use(async (response: AxiosResponse) => {
  const { data = {}, msg } = response?.data || {};
  if (response?.status === 200) {
    return data
  } else {
    ElMessage.error(msg || "系统出错")
    await Promise.reject(response?.data)
  }
}, async (error: any) => {
  const { status, response, message } = error || {},
    { statusText, data } = response || {};
  switch (status) {
    case 401:
      const hash = window.location.hash
      localStorage.clear()
      if (hash.indexOf("#/login") === -1) location.reload()
      break
    case 403:
      window.location.replace(`#/redirect/error?type=inactive&title=您当前无权访问该模块&content=${message || statusText || "当前用户未授权"}`)
      break
    case 302:
      if (data?.url) window.open(data.url)
      break
    default:
      ElMessage.error(statusText || "服务器错误，请联系管理员处理")
      break
  }
  return Promise.reject(response)
})

export default service;

import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios"
import { useStorage } from "@vueuse/core"
import { ElMessage } from "element-plus"

// export const environment = import.meta.env.MODE

// Create an axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 20000,
  withCredentials: true
});

// request interceptor
service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.Authorization = useStorage<string>("XSRF-TOKEN", null).value
  return config
}, (error: any) => Promise.reject(error))

// response interceptor
service.interceptors.response.use(async (response: AxiosResponse) => {
  const { data = {}, code, message } = response?.data || {};
  switch (code) {
    case 100:
    case 200:
      return data;
    case 401:
      const hash = window.location.hash
      localStorage.clear()
      if (hash.indexOf("#/login") === -1) location.reload()
      break
    case 302:
      if (data?.url) window.open(data.url)
      break
    default:
      ElMessage.error(message || "系统出错")
      await Promise.reject(data)
      break
  }
}, async (error: any) => {
  const { response } = error || {},
    message = response?.data?.message || error.message || '网络错误，请检查您的网络';
  ElMessage.error(response?.status === 500 ? "服务器错误，请联系管理员处理" : message)
  return Promise.reject(response)
})

export default service;

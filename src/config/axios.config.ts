import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios"
import { useStorage } from "@vueuse/core"
import { ElMessage } from "element-plus"

const baseURL = (environment => {
  try {
    if (environment === 'development') return import.meta.env.VITE_APP_BASE_API
    return 'http://1.94.19.153:9501/'
  } catch (e) {
    console.log(`System analysis baseURL error, The address has been switched to the ${environment} environment: ${e}`)
    return import.meta.env.VITE_APP_BASE_API
  }
})(import.meta.env.MODE)

// Create an axios instance
const service = axios.create({
  baseURL,
  timeout: 20000,
  withCredentials: true
});

// request interceptor
service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.Token = useStorage<string>("XSRF-TOKEN", null).value
  return config
}, (error: any) => Promise.reject(error))

// response interceptor
service.interceptors.response.use(async (response: AxiosResponse) => {
  const res = response.data, { code, message } = res || {};
  if (response?.headers?.token) localStorage.setItem("XSRF-TOKEN", response.headers.token)
  if (typeof res === "string") return res
  switch (code) {
    case 100:
    case 200:
      return res;
    case 401:
      const hash = window.location.hash
      localStorage.clear()
      if (hash.indexOf("#/login") === -1) location.reload()
      break
    case 302:
      if (res?.url) window.open(res.url)
      break
    default:
      ElMessage.error(message || "系统出错")
      await Promise.reject(res)
      break
  }
}, async (error: any) => {
  const {response} = error || {},
    message = response?.data?.message || error.message || '网络错误，请检查您的网络';
  ElMessage.error(response?.status === 500 ? "服务器错误，请联系管理员处理" : message)
  return Promise.reject(response)
})

export default service;

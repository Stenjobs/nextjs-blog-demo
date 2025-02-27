import axios from 'axios'
import qs from 'qs'
import { toast } from 'react-toastify'
import { store } from '@/store'
import { logout } from '@/store/slices/userSlice'

const service = axios.create({
  // Next.js开发环境使用代理，生产环境使用实际API地址
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api' || '/api',
  withCredentials: false, // 是否携带cookie
  timeout: 60000 // 超时响应
})

// 字节流下载flag
let isBlob = false

// axios拦截器 - 请求头拦截
service.interceptors.request.use(
  config => {
    // 根据请求头判断是否为字节流
    isBlob = config.responseType === 'blob'

    // 从 Redux 获取 token
    const state = store.getState();
    const token = state.user.token;
    
    // 处理头部信息：添加token
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }

    // 请求为表单时
    if (config.contentType === 'form') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    // get请求包含数组时,参数进行qs序列化
    if (config.method === 'get') {
      config.paramsSerializer = params => {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }

    // 请求参数为空时默认给个空对象，undefined和null有一些后端会说报错。
    config.data = config.data || {}
    config.params = config.params || {}
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// axios拦截器 - 响应拦截
service.interceptors.response.use(
  response => {
    // 如果为字节流，直接抛出字节流，不走code验证
    if (isBlob) {
      return response
    }

    const res = response.data

    // 后台返回非200处理
    if (res.code !== 200) {
      // 使用react-toastify显示错误信息
      toast.error(res.msg || 'Error', {
        position: "top-right",
        autoClose: 5000
      })

      // 401: token失效
      if (res.code === 401) {
        if (typeof window !== 'undefined') {
          // 使用 Redux 清除用户信息
          store.dispatch(logout());
          
          if (window.confirm('登录失效，请重新登录')) {
            // Next.js路由跳转
            window.location.href = '/login'
          }
        }
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    toast.error(error.message || 'Request Error', {
      position: "top-right",
      autoClose: 5000
    })
    return Promise.reject(error)
  }
)

export default service

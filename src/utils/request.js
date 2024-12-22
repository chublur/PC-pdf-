import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, removeToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  withCredentials: true,
  headers: {
    'user_token': 'chublur'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = getToken()
    
    if (token) {
      config.headers['user_token'] = token
    }
    
    return config
  },
  error => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器中可以添加token过期的处理
service.interceptors.response.use(
  response => {
    const res = response.data
    
    if (response.config.responseType === 'arraybuffer') {
      return response
    }

    // 假设后端返回401表示token过期
    if (res.code === 401) {
      ElMessage({
        message: 'token已过期，请重新登录',
        type: 'error',
        duration: 5 * 1000
      })
      // 清除token并跳转到登录页
      removeToken()
      // router.push('/login')
      return Promise.reject(new Error('token已过期'))
    }

    if (res.code && res.code !== 200) {
      ElMessage({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  error => {
    console.error('响应错误：', error)
    ElMessage({
      message: error.message || '系统错误',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service 
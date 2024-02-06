import axios from "axios"
import {useAuthStore} from '@/stores/authStore'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  withXSRFToken: true
})

export async function makeRequest<T>(url: string, options?: any): Promise<T> {
  let res = await api(url, options)
  return await res.data
}

api.interceptors.response.use(config => {
  return config
}, async error => {
  if(error.response.status === 401 || error.response.status === 419){
    const authStore = useAuthStore()
    authStore.user = null
    await router.push('/login')
  }
  throw error
})

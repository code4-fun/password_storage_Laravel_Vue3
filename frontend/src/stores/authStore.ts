import {ref, watch} from 'vue'
import {defineStore} from 'pinia'
import {
  getTokenApi,
  getUserApi,
  loginApi,
  registerApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi
} from '@/api/auth'
import router from '@/router'
import type {
  ApiDataResponse,
  ApiStatusResponse,
  AuthData,
  AuthStore,
  IUser,
  ResetPasswordData
} from '@/types'
import {isValidationError} from "@/types";

/**
 * Authentication Store using Pinia
 * @type {import("pinia").DefineStore<"authStore", AuthStore>}
 */
export const useAuthStore = defineStore('authStore', () => {
  const state: AuthStore = {
    user: ref(null),
    errors: ref({}),
    status: ref(null),
    loading: ref(false),
  }
  const userInLocalStorage = localStorage.getItem("user")

  if (userInLocalStorage) {
    state.user.value = JSON.parse(userInLocalStorage)._value
  }

  watch(
    () => state.user,
    newState => localStorage.setItem("user", JSON.stringify(newState)),
    { deep: true }
  )

  /**
   * Get the CSRF token
   * @returns {Promise<void>} - Promise indicating the success or failure of the operation
   */
  const getToken = async () => {
    await getTokenApi({
      uri: '/sanctum/csrf-cookie'
    })
  }

  /**
   * Get user information
   * @returns {Promise<void>} - Promise indicating the success or failure of the operation
   */
  const getUser = async () => {
    const response: ApiDataResponse<IUser> = await getUserApi({
      uri: '/api/user'
    })
    state.user.value = response.data || null
  }

  /**
   * Handle user login
   * @param {AuthData} data - User login data
   * @returns {Promise<void>} - Promise indicating the success or failure of the login operation
   */
  const loginHandler = async (data: AuthData) => {
    state.errors.value = {}
    await getToken()
    try {
      await loginApi({
        uri: '/login',
        body: {...data}
      })
      await getUser()
      await router.push({name: data.to})
    } catch (e) {
      if (isValidationError(e)) {
        state.errors.value = e.response.data.errors
      } else {
        console.error('An unexpected error occurred', (e as Error).message)
      }
    } finally {
      state.loading.value = false
    }
  }

  /**
   * Handle user registration
   * @param {AuthData} data - User registration data
   * @returns {Promise<void>} - Promise indicating the success or failure of the registration operation
   */
  const registerHandler = async (data: AuthData) => {
    state.errors.value = {}
    // await getToken()
    try {
      await registerApi({
        uri: '/register',
        body: {...data}
      })
      await getUser()
      await router.push('/')
    } catch (e) {
      if (isValidationError(e)) {
        state.errors.value = e.response.data.errors
      } else {
        console.error('An unexpected error occurred', (e as Error).message)
      }
    } finally {
      state.loading.value = false
    }
  }

  /**
   * Handle user logout
   * @returns {Promise<void>} - Promise indicating the success or failure of the logout operation
   */
  const logoutHandler = async () => {
    await logoutApi({
      uri: '/logout'
    })
    state.user.value = null
    await router.push('/')
  }

  /**
   * Handle forgot password request
   * @param {string} email - User email for password recovery
   * @returns {Promise<void>} - Promise indicating the success or failure of the password recovery request
   */
  const forgotPasswordHandler = async (email: string) => {
    state.errors.value = {}
    try{
      const response: ApiStatusResponse = await forgotPasswordApi({
        uri: '/forgot-password',
        body: {
          email: email
        }
      })
      state.status.value = response.status ?? null
    } catch(e){
      if (isValidationError(e)) {
        state.errors.value = e.response.data.errors
      } else {
        console.error('An unexpected error occurred', (e as Error).message)
      }
    } finally {
      state.loading.value = false
    }
  }

  /**
   * Handle password reset
   * @param {ResetPasswordData} data - Password reset data
   * @returns {Promise<void>} - Promise indicating the success or failure of the password reset operation
   */
  const resetPasswordHandler = async (data: ResetPasswordData) => {
    state.errors.value = {}
    try{
      const response: ApiStatusResponse = await resetPasswordApi({
        uri: '/reset-password',
        body: {...data}
      })
      state.status.value = response.status ?? null
    } catch(e){
      if (isValidationError(e)) {
        state.errors.value = e.response.data.errors
      } else {
        console.error('An unexpected error occurred', (e as Error).message)
      }
    } finally {
      state.loading.value = false
    }
  }

  return {
    ...state,
    getUser,
    loginHandler,
    registerHandler,
    logoutHandler,
    forgotPasswordHandler,
    resetPasswordHandler
  }
})

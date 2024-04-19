import {ref} from 'vue'
import {defineStore} from 'pinia'
import {
  getUsersApi
} from '@/api/user'
import type {
  ApiDataResponse,
  UserStore
} from "@/types";

/**
 * User Store using Pinia
 * @type {import("pinia").DefineStore<"userStore", UserStore>}
 */
export const useUserStore = defineStore('userStore', () => {
  const state: UserStore = {
    users: ref([]),
    loading: ref(false),
    errors: ref({}),
  }

  /**
   * Fetches users from the API and updates the store state accordingly.
   *
   * @async
   * @function
   * @memberof useUserStore
   */
  const fetchUsers = async () => {
    try{
      state.loading.value = true
      const response: ApiDataResponse<any> = await getUsersApi({
        uri: '/api/v1/users'
      })
      state.users.value = response.data
    } catch(e){
      console.log(e)
    } finally {
      state.loading.value = false
    }
  }

  return {
    ...state,
    fetchUsers
  }
})

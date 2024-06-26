import {markRaw, ref} from 'vue'
import {defineStore} from 'pinia'
import {
  createGroupApi,
  getPasswordsApi,
  changePasswordGroupApi,
  updateUserPasswordPivotTable,
  getGroupApi,
  updateGroupApi,
  deleteGroupApi,
  createPasswordApi,
  deletePasswordApi,
  updatePasswordApi,
  fetchAllowedUsersApi,
  fetchPasswordApi
} from '@/api/password'
import type {
  ApiDataResponse,
  DragObjectInfo,
  Group,
  ModalContent,
  Password,
  PasswordStore,
  PasswordToggleResponse,
  StorePasswordItem
} from "@/types";
import {
  isAdminPasswords,
  isUserPasswords,
  isValidationError
} from "@/types";
import cloneDeep from 'lodash/cloneDeep'

/**
 * Password Store using Pinia
 *
 * @type {import("pinia").DefineStore<"passwordStore", PasswordStore>}
 */
export const usePasswordStore = defineStore('passwordStore', () => {
  const state: PasswordStore = {
    passwords: ref([]),
    groups: ref([]),
    loading: ref(false),
    formLoading: ref(false),
    errors: ref({}),
    dragObjectInfo: ref(null),
    modalVisible: ref(false),
    modalContent: ref(null),
    allowedUsers: ref([]),
    allowedUsersLoading: ref(false)
  }

  /**
   * Fetches passwords from the API and updates the store state accordingly.
   *
   * @async
   * @function
   * @memberof usePasswordStore
   */
  const fetchPasswords = async () => {
    try{
      state.loading.value = true
      const response: ApiDataResponse<any> = await getPasswordsApi({
        uri: '/api/v1/passwords'
      })
      if(isAdminPasswords(response.data)){
        state.passwords.value = response.data.passwords
      } else if (isUserPasswords(response.data)){
        state.passwords.value = response.data.passwords
        state.groups.value = response.data.groups
      }
    } catch(e){
      console.log(e)
    } finally {
      state.loading.value = false
    }
  }

  /**
   * Sets the drag object information during drag-and-drop operations.
   *
   * @function
   * @memberof usePasswordStore
   * @param {DragObjectInfo|null} value - Information about the dragged object or `null` if no object is being dragged.
   */
  const setDragObjectInfo = (value: DragObjectInfo | null) => {
    state.dragObjectInfo.value = value
  }

  /**
   * Change the group of a password
   *
   * @param {number} passwordId - The ID of the password to be moved
   * @param {number | null} toGroupId - The ID of the destination group
   * @param {number | null} [fromGroupId=null] - The ID of the source group (optional, defaults to null)
   * @returns {Promise<void>} - Promise indicating the success or failure of the operation
   */
  const changeGroup = async (passwordId: number, toGroupId: number | null, fromGroupId: number | null = null): Promise<void> => {
    const groups = cloneDeep(state.groups.value)
    const passwords = cloneDeep(state.passwords.value)

    changeGroupLocally(passwordId, toGroupId, fromGroupId)

    try{
      await changePasswordGroupApi({
        uri: '/api/v1/passwords/groups',
        body: {
          password_id: passwordId,
          ...(fromGroupId && {from_group_id: fromGroupId}),
          ...(toGroupId && {to_group_id: toGroupId})
        }
      })
    } catch(e){
      state.groups.value = groups
      state.passwords.value = passwords
    }
  }

  /**
   * Change the group of a password in the local store
   *
   * @param {number} passwordId - The ID of the password to be moved
   * @param {number | null} toGroupId - The ID of the destination group
   * @param {number | null} [fromGroupId=null] - The ID of the source group (optional, defaults to null)
   */
  const changeGroupLocally = (passwordId: number, toGroupId: number | null, fromGroupId: number | null = null) => {
    if(fromGroupId && toGroupId){  // пароль перемещается из одной группы в другую группу
      const fromGroupIndex = state.groups.value.findIndex(i => i.id === fromGroupId)
      const fromGroup = state.groups.value[fromGroupIndex]
      const elementIndex = fromGroup.passwords?.findIndex(i => i.id === passwordId)
      const element = fromGroup.passwords.splice(elementIndex, 1)[0]
      const toGroupIndex = state.groups.value.findIndex(i => i.id === toGroupId)
      state.groups.value[toGroupIndex].passwords.push(element)
    } else if(!fromGroupId){  // пароль перемещается из несгруппированных в группу
      const elementIndex = state.passwords.value.findIndex(i => i.id === passwordId)
      const element = state.passwords.value.splice(elementIndex, 1)[0]
      const toGroupIndex = state.groups.value.findIndex(i => i.id === toGroupId)
      state.groups.value[toGroupIndex].passwords.push(element)
    } else if(!toGroupId){  // пароль перемещается из группы в несгруппированные
      const fromGroupIndex = state.groups.value.findIndex(i => i.id === fromGroupId)
      const fromGroup = state.groups.value[fromGroupIndex]
      const elementIndex = fromGroup.passwords.findIndex(i => i.id === passwordId)
      const element = fromGroup.passwords.splice(elementIndex, 1)[0]
      state.passwords.value.push(element)
    }
  }

  /**
   * Toggles the permission of a password for a specific user, updating both local state and making API calls.
   * Password permission in the local state is updated right away and then an API call is made to update the
   * user-password pivot table.
   * If the API response indicates an empty array, it means the update did not succeed. In this case, the local
   * state is reverted to its previous state.
   * If the API response contains data, it compares the new permission status with the provided permitted
   * parameter. If they differ, it updates the local state with the received data.
   *
   * @async
   * @function
   * @memberof usePasswordStore
   * @param {number} passwordId - The identifier of the password for which permission needs to be toggled.
   * @param {number} userId - The identifier of the user whose permission is being toggled for the specified password.
   * @param {boolean} permitted - A boolean value indicating whether the permission should be granted (`true`) or revoked (`false`).
   */
  const togglePasswordPermission = async (passwordId: number, userId: number, permitted: boolean) => {
    changePasswordPermission(passwordId, userId, permitted)

    try{
      const response: ApiDataResponse<PasswordToggleResponse> = await updateUserPasswordPivotTable({
        uri: `/api/v1/passwords/${passwordId}/users/${userId}`,
        body: {
          permitted: permitted
        }
      })

      if(Array.isArray(response.data) && response.data.length === 0){
        changePasswordPermission(passwordId, userId, !permitted)
      } else if (Boolean(permitted) !== Boolean(response.data.permitted)){
        changePasswordPermission(
          response.data.password_id,
          response.data.user_id,
          response.data.permitted
        )
      }
    } catch(e){
      changePasswordPermission(passwordId, userId, !permitted)
    }
  }

  /**
   * Toggle visibility of a modal with optional content
   *
   * @param {boolean} visible - Whether to make the modal visible or not
   * @param {ModalContent | null} modalContent - Optional content to be displayed in the modal
   * @returns {void}
   */
  const toggleModal = (visible: boolean, modalContent: ModalContent | null) => {
    state.modalVisible.value = visible
    state.modalContent.value = modalContent
  }

  /**
   * Get a non-reactive copy of the current modal content
   *
   * @returns {ModalContent | null} - Non-reactive modal content or null if no content is present
   */
  const getNonReactiveModalContent = (): ModalContent | null => {
    return state.modalContent.value
      ? markRaw(cloneDeep(state.modalContent.value))
      : null
  }

  /**
   * Store a new group
   *
   * @param {Group} group - The group to be stored
   * @returns {Promise<void>} - Promise indicating the success or failure of the operation
   */
  const storeGroup = async (group: Group) => {
    state.formLoading.value = true
    try{
      const response = await createGroupApi({
        uri: '/api/v1/groups',
        body: {
          name: group.name
        }
      })
      if(!state.groups.value.find(i => i.id === response.data.id)){
        state.groups.value.push({
          ...response.data,
          passwords: []
        })
      }
      toggleModal(false, null)
    } catch(e){
      if (isValidationError(e)) {
        state.errors.value = e.response.data.errors
      } else {
        console.error('An unexpected error occurred', (e as Error).message)
      }
    } finally {
      state.formLoading.value = false
    }
  }

  /**
   * Update an existing group
   *
   * @param {Group} group - The group with updated information
   * @returns {Promise<void>} - Promise indicating the success or failure of the operation
   */
  const updateGroup = async (group: Group) => {
    state.formLoading.value = true
    try{
      const response = await updateGroupApi({
        uri: `/api/v1/groups/${group.id}`,
        body: {
          ...group
        }
      })
      state.groups.value.forEach((group, index, array) => {
        group.id === response.data.id && (array[index] = {...group, name: response.data.name})
      })
      toggleModal(false, null)
    } catch(e){
      if (isValidationError(e)) {
        state.errors.value = e.response.data.errors
      } else {
        console.error('An unexpected error occurred', (e as Error).message)
      }
    }finally {
      state.formLoading.value = false
    }
  }

  /**
   * Delete a group by ID
   *
   * @param {number} groupId - The ID of the group to be deleted
   * @returns {Promise<void>} - Promise indicating the success or failure of the operation
   */
  const deleteGroup = async (groupId: number) => {
    try{
      const response = await deleteGroupApi({
        uri: `/api/v1/groups/${groupId}`
      })
      const indexToDelete = state.groups.value.findIndex(i => i.id === response.data);
      indexToDelete !== -1 && state.groups.value.splice(indexToDelete, 1);
    } catch(e){
      console.log(e)
      throw e
    }
  }

  /**
   * Fetch a group by ID
   *
   * @param {number} groupId - The ID of the group to be fetched
   * @returns {Promise<Group>} - Promise resolving to the fetched group
   */
  const fetchGroup = async (groupId: number): Promise<Group> => {
    try{
      const response = await getGroupApi({
        uri: `/api/v1/groups/${groupId}`
      })
      return response.data
    } catch(e){
      console.log(e)
      throw e
    }
  }

  /**
   * Stores a new password.
   *
   * @param {Password} password - The password to store.
   */
  const storePassword = async (password: Password) => {
    try{
      state.formLoading.value = true
      const response = await createPasswordApi({
        uri: '/api/v1/passwords',
        body: {
          ...password
        }
      })
      if(response.data?.group){
        const targetGroup = state.groups.value.find(i => i.id === response.data.group)
        const {group, ...password} = response.data
        targetGroup?.passwords.push(password)
      } else {
        state.passwords.value.push(response.data)
      }
      toggleModal(false, null)
    } catch(e){
      if (isValidationError(e)) {
        state.errors.value = e.response.data.errors
      } else {
        console.error('An unexpected error occurred', (e as Error).message)
      }
    } finally {
      state.formLoading.value = false
    }
  }

  /**
   * Updates a password.
   *
   * @param {Password} password - The password to update.
   */
  const updatePassword = async (password: Password) => {
    try{
      state.formLoading.value = true
      const response = await updatePasswordApi({
        uri: `/api/v1/passwords/${password.id}`,
        body: {
          ...password
        }
      })
      if(password.fromGroupId){
        state.groups.value.forEach(item => {
          if(item.id === password.fromGroupId){
            updatePasswordData(item.passwords, response.data)
          }
        })
      } else {
        updatePasswordData(state.passwords.value, response.data)
      }
      if(password.toGroupId === -1 || password.toGroupId === password.fromGroupId){
        toggleModal(false, null)
        return
      }
      password.id && password.toGroupId && changeGroupLocally(
        password.id,
        password.toGroupId === -2 ? null : password.toGroupId,
        password.fromGroupId
      )
      toggleModal(false, null)
    } catch(e){
      if (isValidationError(e)) {
        state.errors.value = e.response.data.errors
      } else {
        console.error('An unexpected error occurred', (e as Error).message)
      }
    } finally {
      state.formLoading.value = false
    }
  }

  /**
   * Updates the password data in the provided array of passwords.
   *
   * @param {Password[]} passwords - The array of passwords to update.
   * @param {Password} newPassword - The new password data to update.
   */
  const updatePasswordData = (passwords: StorePasswordItem[], newPassword: StorePasswordItem) => {
    passwords.forEach((item, index, array) => {
      item.id === newPassword.id && (array[index] = {
        ...item,
        name: newPassword.name,
        updated: newPassword.updated,
        description: newPassword.description
      })
    })
  }

  /**
   * Deletes a password.
   *
   * @param {number} passwordId - The ID of the password to delete.
   * @param {number | null} groupId - The ID of the group from which the password is deleted (optional).
   */
  const deletePassword = async (passwordId: number, groupId: number | null = null) => {
    try{
      const response = await deletePasswordApi({
        uri: `/api/v1/passwords/${passwordId}`
      })
      if(groupId){
        const targetGroup = state.groups.value.find(i => i.id === groupId)
        const indexToDelete = targetGroup?.passwords.findIndex(i => i.id === response.data) as number
        indexToDelete !== -1 && targetGroup?.passwords.splice(indexToDelete, 1)
      } else {
        const indexToDelete = state.passwords.value.findIndex(i => i.id === response.data) as number
        indexToDelete !== -1 && state.passwords.value.splice(indexToDelete, 1)
      }
    } catch(e){
      console.log(e)
      throw e
    }
  }

  const fetchPassword = async (passwordId: number) => {
    const response = await fetchPasswordApi({
      uri: `/api/v1/passwords/${passwordId}`
    })
    console.log(response)
  }

  /**
   * Fetches allowed users for a specific password from the backend API and updates the state.
   *
   * @param {number | undefined} passwordId - The ID of the password.
   */
  const fetchAllowedUsers = async (passwordId: number | undefined) => {
    if(!passwordId) return
    try{
      state.allowedUsersLoading.value = true
      const response = await fetchAllowedUsersApi({
        uri: `/api/v1/passwords/${passwordId}/allowed_users`
      })
      state.allowedUsers.value = response.data
    } catch(e){
      console.log(e)
      throw e
    } finally {
      state.allowedUsersLoading.value = false
    }
  }

  /**
   * Updates the permission of a password for a specific user in the local state.
   *
   * @function
   * @memberof usePasswordStore
   * @param {number} passwordId - The identifier of the password.
   * @param {number} userId - The identifier of the user.
   * @param {boolean} permitted - A boolean value indicating whether the permission should be granted (`true`) or revoked (`false`).
   */
  const changePasswordPermission = (passwordId: number, userId: number, permitted: boolean) => {
    state.passwords.value.forEach(i => {
      if(i.id === passwordId){
        i.users && i.users.forEach(j => {
          if(j.id === userId){
            j.permitted = permitted
          }
        })
      }
    })
  }

  return {
    ...state,
    fetchPasswords,
    togglePasswordPermission,
    setDragObjectInfo,
    changeGroup,
    toggleModal,
    getNonReactiveModalContent,
    storeGroup,
    fetchGroup,
    updateGroup,
    deleteGroup,
    storePassword,
    deletePassword,
    updatePassword,
    fetchAllowedUsers,
    fetchPassword
  }
})

import {markRaw, ref} from 'vue'
import {defineStore} from 'pinia'
import {
  createGroupApi,
  getPasswordsApi,
  changePasswordGroupApi,
  updateUserPasswordPivotTable,
  getGroupApi,
  updateGroupApi,
  deleteGroupApi
} from '@/api/password'
import type {
  ApiDataResponse,
  DragObjectInfo,
  Group,
  ModalContent,
  PasswordStore,
  PasswordToggleResponse
} from "@/types";
import {isAdminPasswords, isUserPasswords} from "@/types";
import cloneDeep from 'lodash/cloneDeep'

/**
 * Password Store using Pinia
 * @type {import("pinia").DefineStore<"passwordStore", PasswordStore>}
 */
export const usePasswordStore = defineStore('passwordStore', () => {
  const state: PasswordStore = {
    passwords: ref([]),
    groups: ref([]),
    loading: ref(false),
    errors: ref({}),
    dragObjectInfo: ref(null),
    modalVisible: ref(false),
    modalContent: ref(null)
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
   * @param {number} passwordId - The ID of the password to be moved
   * @param {number | null} toGroupId - The ID of the destination group
   * @param {number | null} [fromGroupId=null] - The ID of the source group (optional, defaults to null)
   * @returns {Promise<void>} - Promise indicating the success or failure of the operation
   */
  const changeGroup = async (passwordId: number, toGroupId: number | null, fromGroupId: number | null = null) => {
    const groups = cloneDeep(state.groups.value)
    const passwords = cloneDeep(state.passwords.value)

    if(fromGroupId && toGroupId){
      const fromGroupIndex = state.groups.value.findIndex(i => i.id === fromGroupId)
      const fromGroup = state.groups.value[fromGroupIndex]
      const elementIndex = fromGroup.passwords?.findIndex(i => i.id === passwordId)
      const element = fromGroup.passwords.splice(elementIndex, 1)[0]
      const toGroupIndex = state.groups.value.findIndex(i => i.id === toGroupId)
      state.groups.value[toGroupIndex].passwords.push(element)
    } else if(!fromGroupId){
      const elementIndex = state.passwords.value.findIndex(i => i.id === passwordId)
      const element = state.passwords.value.splice(elementIndex, 1)[0]
      const toGroupIndex = state.groups.value.findIndex(i => i.id === toGroupId)
      state.groups.value[toGroupIndex].passwords.push(element)
    } else if(!toGroupId){
      const fromGroupIndex = state.groups.value.findIndex(i => i.id === fromGroupId)
      const fromGroup = state.groups.value[fromGroupIndex]
      const elementIndex = fromGroup.passwords.findIndex(i => i.id === passwordId)
      const element = fromGroup.passwords.splice(elementIndex, 1)[0]
      state.passwords.value.push(element)
    }

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
      console.log(e)
      state.groups.value = groups
      state.passwords.value = passwords
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
   * Toggle the visibility of a modal with optional content
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
   * @returns {ModalContent | null} - Non-reactive modal content or null if no content is present
   */
  const getNonReactiveModalContent = (): ModalContent | null => {
    return state.modalContent.value
      ? markRaw(cloneDeep(state.modalContent.value))
      : null
  }

  /**
   * Store a new group
   * @param {Group} group - The group to be stored
   * @returns {Promise<void>} - Promise indicating the success or failure of the operation
   */
  const storeGroup = async (group: Group) => {
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
    } catch(e){
      console.log(e)
    }
  }

  /**
   * Update an existing group
   * @param {Group} group - The group with updated information
   * @returns {Promise<void>} - Promise indicating the success or failure of the operation
   */
  const updateGroup = async (group: Group) => {
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
      console.log(e)
      throw e
    }
  }

  /**
   * Delete a group by ID
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
    deleteGroup
  }
})

import type {Component, Ref} from "vue";
import type {AxiosError, AxiosResponse} from "axios";
import axios from "axios";

export interface RequestBody {
  [key: string]: string | boolean | number | number[] | null
}

export interface ApiRequest {
  uri: string
  body?: RequestBody
}

export interface IUser {
  id: number
  name: string
  roles: string[]
}

export interface ApiDataResponse<T> {
  data: T
}

export interface ApiStatusResponse {
  status?: string
}

export interface AuthErrorData {
  email?: string[]
  password?: string[]
  name?: string[]
  token?: string[]
}

export interface AuthStore {
  user: Ref<IUser | null>
  errors: Ref<AuthErrorData>
  status: Ref<string | null>
  loading: Ref<boolean>
}

export interface AuthData {
  name?: string
  email: string
  password: string
  password_confirmation?: string
  to?: string
}

export interface ResetPasswordData {
  password: string
  password_confirmation: string
  email: string
  token: string
}

export interface PasswordUser {
  id: number
  name: string
  owner: boolean
  permitted: boolean
}

export interface BasePassword {
  name: string
  description: string
}

export interface Password extends BasePassword {
  id?: number
  password?: string
  allowedUsers: number[]
  fromGroupId?: number | null
  toGroupId?: number | null
}

export interface StorePasswordItem extends BasePassword {
  id: number
  updated: string
  owner: boolean
  group?:number
  users?: PasswordUser[]
}

export interface StoreGroupItem {
  id: number
  name: string
  passwords: StorePasswordItem[]
}

export interface DragObjectInfo {
  fromGroupId?: number
  passwordId: number
  type: string
}

export interface ModalContent {
  component: Component
  props: any
}

export type Collapsible = StorePasswordItem | StoreGroupItem

export interface PasswordErrorData {
  name?: string[]
  password?: string[]
  description?: string[]
}

export interface PasswordStore {
  passwords: Ref<StorePasswordItem[]>
  groups: Ref<StoreGroupItem[]>
  loading: Ref<boolean>
  formLoading: Ref<boolean>
  errors: Ref<PasswordErrorData>
  dragObjectInfo: Ref<DragObjectInfo | null>
  modalVisible: Ref<boolean>
  modalContent: Ref<ModalContent | null>
  allowedUsers: Ref<number[]>
  allowedUsersLoading: Ref<boolean>
}

interface ValidationResponse extends AxiosResponse {
  status: 422
  data: {
    message: string;
    errors: Record<string, string[]>
  };
}

export interface ValidationError extends AxiosError {
  response: ValidationResponse
}

export function isValidationError(error: unknown): error is ValidationError {
  return Boolean(
    axios.isAxiosError(error)
    && error.response
    && error.response.status === 422
    && typeof error.response.data?.message === 'string'
    && typeof error.response.data?.errors === 'object'
  )
}

export interface CheckboxData {
  [key: string]: number
}

export interface PasswordToggleResponse {
  password_id: number
  user_id: number
  permitted: boolean
}

export interface PasswordGroupChangeResponse {
  password_id: number
  group_from_id: number
  group_to_id: boolean
}

export interface CreateGroupResponse {
  id: number
  name: string
}

export interface AdminPasswordsResponse {
  passwords: StorePasswordItem[]
}

export function isAdminPasswords(response: any): response is AdminPasswordsResponse {
  return (
    response &&
    response.passwords !== undefined &&
    Array.isArray(response.passwords) &&
    Object.keys(response).length === 1
  )
}

export interface UserPasswordsResponse {
  groups: StoreGroupItem[]
  passwords: StorePasswordItem[]
}

export function isUserPasswords(response: any): response is UserPasswordsResponse {
  return (
    response &&
    response.groups !== undefined &&
    response.passwords !== undefined &&
    Array.isArray(response.groups) &&
    Array.isArray(response.passwords) &&
    Object.keys(response).length === 2
  )
}

export interface DropdownOption {
  name: string,
  action?: () => void
}

export interface Group {
  id?: number
  name: string
}

export interface SelectItem {
  id: number
  name: string
  disabled?: boolean
}

export interface AppErrorData {
}

export interface UserStore {
  users: Ref<StoreUserItem[]>
  loading: Ref<boolean>
  errors: Ref<AppErrorData>
}

export interface StoreUserItem {
  id: number
  name: string
}

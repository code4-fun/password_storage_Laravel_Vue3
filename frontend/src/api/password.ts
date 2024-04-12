import {makeRequest} from "./index";
import type {
  ApiDataResponse,
  ApiRequest,
  CreateGroupResponse,
  Group,
  PasswordGroupChangeResponse,
  StorePasswordItem,
  PasswordToggleResponse,
  Password
} from "@/types";

export const getPasswordsApi = (request: ApiRequest) => {
  return makeRequest<ApiDataResponse<StorePasswordItem[]>>(request.uri)
}

export const updateUserPasswordPivotTable = (request: ApiRequest) => {
  return makeRequest<ApiDataResponse<PasswordToggleResponse>>(request.uri, {
    method: 'PATCH',
    data: request.body
  })
}

export const changePasswordGroupApi = (request: ApiRequest) => {
  return makeRequest<ApiDataResponse<PasswordGroupChangeResponse>>(request.uri, {
    method: 'PATCH',
    data: request.body
  })
}

export const createGroupApi = (request: ApiRequest) => {
  return makeRequest<ApiDataResponse<CreateGroupResponse>>(request.uri, {
    method: 'POST',
    data: request.body
  })
}

export const updateGroupApi = (request: ApiRequest) => {
  return makeRequest<ApiDataResponse<Group>>(request.uri, {
    method: 'PUT',
    data: request.body
  })
}

export const deleteGroupApi = (request: ApiRequest) => {
  return makeRequest<ApiDataResponse<number>>(request.uri, {
    method: 'DELETE'
  })
}

export const getGroupApi = (request: ApiRequest) => {
  return makeRequest<ApiDataResponse<Group>>(request.uri, {
    method: 'GET'
  })
}

export const createPasswordApi = (request: ApiRequest) => {
  return makeRequest<ApiDataResponse<Password>>(request.uri, {
    method: 'POST',
    data: request.body
  })
}

export const updatePasswordApi = (request: ApiRequest) => {
  return makeRequest<ApiDataResponse<Password>>(request. uri, {
    method: 'PUT',
    data: request.body
  })
}

export const deletePasswordApi = (request: ApiRequest) => {
  return makeRequest<ApiDataResponse<number>>(request.uri, {
    method: 'DELETE'
  })
}

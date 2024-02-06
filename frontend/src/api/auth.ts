import {makeRequest} from "./index"
import type {ApiDataResponse, ApiRequest, ApiStatusResponse, IUser} from "@/types";

export const getTokenApi = (request: ApiRequest) => {
  return makeRequest(request.uri)
}

export const getUserApi = (request: ApiRequest): Promise<ApiDataResponse<IUser>> => {
  return makeRequest<ApiDataResponse<IUser>>(request.uri)
}

export const loginApi = (request: ApiRequest) => {
  return makeRequest(request.uri, {
    method: 'POST',
    data: request.body
  })
}

export const registerApi = (request: ApiRequest) => {
  return makeRequest(request.uri, {
    method: 'POST',
    data: request.body
  })
}

export const logoutApi = (request: ApiRequest) => {
  return makeRequest(request.uri, {
    method: 'POST'
  })
}

export const forgotPasswordApi = (request: ApiRequest): Promise<ApiStatusResponse> => {
  return makeRequest<ApiStatusResponse>(request.uri, {
    method: 'POST',
    data: request.body
  })
}

export const resetPasswordApi = (request: ApiRequest): Promise<ApiStatusResponse> => {
  return makeRequest<ApiStatusResponse>(request.uri, {
    method: 'POST',
    data: request.body
  })
}

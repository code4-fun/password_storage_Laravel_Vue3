import type {
  ApiDataResponse,
  ApiRequest,
  StoreUserItem
} from "@/types";
import {makeRequest} from "./index"

export const getUsersApi = (request: ApiRequest) => {
  return makeRequest<ApiDataResponse<StoreUserItem[]>>(request.uri)
}

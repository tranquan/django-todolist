import { handleError } from "./errorHandler";
import { stringify } from "qs";

let BASE_URL = "http://localhost:8000/api/";

interface ClientConfig {
  baseUrl?: string;
}

export function configureClient(configs: ClientConfig) {
  if (configs.baseUrl) {
    BASE_URL = configs.baseUrl;
  }
}

export function getClientConfig() {
  return {
    baseUrl: BASE_URL,
  };
}

interface StringMap {
  [k: string]: string;
}

export interface GetOptions {
  queryData: {};
  headers: StringMap;
}

export interface BodyRequestOptions {
  data: {};
  isFormData: boolean;
  headers: StringMap;
}

function serialize(obj: object): string {
  return stringify(obj, { allowDots: true });
}

function initRequest(): RequestInit {
  return {
    mode: "cors",
    cache: "default",
    credentials: "same-origin",
    headers: {
      Accept: "application/json, */*",
      "Content-Type": "application/json;charset=UTF-8",
    },
  };
}

/**
 * Fetch: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 * Request: https://developer.mozilla.org/en-US/docs/Web/API/Request
 */
function request(method: string, path: string, options: Partial<GetOptions & BodyRequestOptions> = {}): Promise<any> {
  const fetchRequest = initRequest();
  fetchRequest.method = method;

  if (options.isFormData) {
    (fetchRequest.headers as any)["Content-Type"] = "application/form-data";
    fetchRequest.body = options.data as any;
  } else if (Object.keys(options.data ?? {}).length > 0) {
    (fetchRequest.headers as any)["Content-Type"] = "application/json;charset=UTF-8";
    fetchRequest.body = JSON.stringify(options.data);
  }

  const fetchUrl = BASE_URL + path;
  return fetch(fetchUrl, fetchRequest)
    .then(response => {
      return handleError(response);
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      // fake slow loading
      // return new Promise((res, rej) => {
      //   setTimeout(() => {
      //     res(data);
      //   }, 2000);
      // });
      // -- end
      return data;
    })
    .catch(error => {
      console.log(`error:`, error);
      throw error;
    });
}

export function getRequest(path: string, queryData: object = {}) {
  return getRequestWithOptions(path, { queryData });
}

export function getRequestWithOptions(path: string, options: Partial<GetOptions> = {}) {
  const { queryData } = options;
  let pathWithQueryString = path;

  if (queryData && Object.keys(queryData).length > 0) {
    pathWithQueryString += "?" + serialize(queryData);
  }

  return request("GET", pathWithQueryString, options);
}

export function postRequest(path: string, data: object = {}, isFormData: boolean = false) {
  return request("POST", path, { data, isFormData });
}

export function postRequestWithOptions(path: string, options: Partial<BodyRequestOptions> = {}) {
  return request("POST", path, options);
}

export function deleteRequest(path: string, data: object = {}) {
  return request("DELETE", path, { data });
}

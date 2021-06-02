import { stringify } from "qs";
import { handleError } from "./errorHandler";
import { createRequest, serialize } from "./utils";

let BASE_URL = "http://localhost";

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

const defaultOptions: GetOptions & BodyRequestOptions = {
  queryData: {},
  data: {},
  isFormData: false,
  headers: {},
};

function request(method: string, path: string, options: Partial<GetOptions | BodyRequestOptions> = {}): Promise<any> {
  const optionsWithDefaults = {
    ...defaultOptions,
    ...options,
  };

  const { data, isFormData, headers } = optionsWithDefaults;
  const fetchRequest = createRequest(method, data, isFormData);

  fetchRequest.headers["Cache-Control"] = "no-cache";
  fetchRequest.headers.Pragma = "no-cache";

  fetchRequest.headers = {
    ...fetchRequest.headers,
    ...headers,
  };

  // fetch
  const fetchUrl = BASE_URL + path;
  return fetch(fetchUrl, fetchRequest)
    .then(response => {
      // console.log("request: ", response);
      return handleError(response);
    })
    .then(response => {
      // console.log("errorHandler: ", response);
      return response.json();
    })
    .then(data => {
      // console.log("normalizeResponse: ", data);
      // fake slow loading
      // return new Promise((res, rej) => {
      //   setTimeout(() => {
      //     res(data);
      //   }, 2000);
      // });
      // -- end
      return data;
    })
    .catch(err => {
      throw err;
    });
}

export function get(path: string, queryData: object = {}) {
  return getWithOptions(path, { queryData });
}

export function getWithOptions(path: string, options: Partial<GetOptions> = {}) {
  const { queryData } = options;
  let pathWithQueryString = path;

  if (queryData && Object.keys(queryData).length > 0) {
    pathWithQueryString += "?" + serialize(queryData);
  }

  return request("GET", pathWithQueryString, options);
}

export function post(path: string, data: object = {}, isFormData: boolean = false) {
  return request("POST", path, { data, isFormData });
}

export function postWithOptions(path: string, options: Partial<BodyRequestOptions> = {}) {
  return request("POST", path, options);
}

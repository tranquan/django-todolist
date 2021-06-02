// ref: https://developer.mozilla.org/en-US/docs/Web/API/Request

import { stringify } from "qs";

// or partial of RequestInit
export type RequestOption = {
  method: string;
  body?: any;
  headers?: any;
  mode?: "cors" | "no-cors";
  credentials?: "include";
  cache?: "no-store";
};

export function createRequest(method: string, data: object, isFormData: boolean = false) {
  const options: RequestOption = {
    method,
    credentials: "include",
    headers: {
      Accept: "application/json, */*",
    },
  };

  if (isFormData) {
    options.headers["Content-Type"] = "application/form-data";
    options.body = data;
  } else if (Object.keys(data).length > 0) {
    options.headers["Content-Type"] = "application/json;charset=UTF-8";
    options.body = JSON.stringify(data);
  }

  return options;
}

export function serialize(obj: object): string {
  return stringify(obj, { allowDots: true });
}

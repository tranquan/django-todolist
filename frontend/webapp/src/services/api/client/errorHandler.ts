import EventEmitter from "src/services/eventEmitter";

export class ApiError extends Error {
  response: Response;

  constructor(message: string, response: Response) {
    super(message);
    this.response = response.clone();
  }

  static isApiError(error: any) {
    return error && error.response && error.response instanceof Response;
  }
}

export enum ApiEvents {
  /** http status = 400 */
  BAD_REQUEST = "BAD_REQUEST",
  /** http status = 401 */
  UN_AUTHORIZED = "UN_AUTHORIZED",
  /** http status = 403 */
  FORBIDDEN = "FORBIDDEN",
  /** http status = 302 */
  RESPONSE_REDIRECT = "RESPONSE_REDIRECT",
}

export function isResponseError(response: Response) {
  if (response.status === 200) {
    return false;
  }
  return true;
}

function _handleError(response: Response) {
  switch (response.status) {
    case 302:
      EventEmitter.notify(ApiEvents.RESPONSE_REDIRECT, { url: response.url });
      break;
    case 400:
      EventEmitter.notify(ApiEvents.BAD_REQUEST, { url: response.url });
      break;
    case 401:
      EventEmitter.notify(ApiEvents.UN_AUTHORIZED, { url: response.url });
      break;
    case 403:
      EventEmitter.notify(ApiEvents.FORBIDDEN, { url: response.url });
      break;
  }
}

export function handleError(response: Response): Response {
  if (isResponseError(response)) {
    _handleError(response);
    const message = `status: ${response.status}; url: ${response.url}`;
    throw new ApiError(message, response);
  }

  // No error => continue
  return response;
}

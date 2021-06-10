import { useCallback, useEffect, useReducer, useRef } from "react";

import { stringify } from "qs";

// --------------------------------------------------
// Hook Reducer
// --------------------------------------------------

export interface FetchState<T> {
  loading: boolean;
  data?: T;
  error: unknown;
}

enum FetchActionType {
  RequestStart = "RequestStart",
  RequestSuccess = "RequestSuccess",
  RequestError = "RequestError",
}

type FetchAction<T> =
  | { type: FetchActionType.RequestStart }
  | { type: FetchActionType.RequestSuccess; data: T }
  | { type: FetchActionType.RequestError; error: unknown };

function fetchReducer<T>(state: FetchState<T>, action: FetchAction<T>): FetchState<T> {
  switch (action.type) {
    case FetchActionType.RequestStart:
      // reset error because this is a new request
      // no-reset data because it's more flexible; can access the old data even when request failure
      return {
        ...state,
        loading: true,
        error: undefined,
      };
    case FetchActionType.RequestSuccess:
      return {
        ...state,
        loading: false,
        data: action.data,
        error: undefined,
      };
    case FetchActionType.RequestError:
      // make sure error !== undefined
      return {
        ...state,
        loading: false,
        data: undefined,
        error: action.error,
      };
    default:
      return state;
  }
}

// --------------------------------------------------
// Hook
// --------------------------------------------------

interface FetchArg<T, P extends unknown[]> {
  request: (...params: P) => Promise<T>;
  params: P;
  isLazy: boolean;
}

type DoFetch<T, P extends unknown[]> = (params?: P) => Promise<FetchState<T>>;

const initialState: FetchState<unknown> = {
  loading: false,
  data: undefined,
  error: undefined,
};

function _useFetch<T, P extends unknown[]>({
  request,
  params,
  isLazy,
}: FetchArg<T, P>): [FetchState<T>, DoFetch<T, P>] {
  const [state, dispatch] = useReducer(fetchReducer, initialState);
  let cancelledRef = useRef(false);
  let paramsQuery = "";
  try {
    paramsQuery = stringify(params);
  } catch (error) {
    // do nothing
  }

  const doFetch = useCallback(
    (overrideParams?: P) => {
      // console.warn(`------------------------------ _useFetch. useCallback:`);
      dispatch({ type: FetchActionType.RequestStart });
      // Append this after request to test slow network
      /** 
      .then(response => {
        return timeout(1000).then(() => {
          return response;
        });
      })
      */
      return request(...(overrideParams ? overrideParams : params))
        .then(response => {
          // console.warn(`------------------------------ _useFetch. response: cancelled: `, cancelled);
          if (!cancelledRef.current) {
            dispatch({ type: FetchActionType.RequestSuccess, data: response });
          }
          return {
            loading: false,
            data: response,
            error: undefined,
          };
        })
        .catch(error => {
          if (!cancelledRef.current) {
            dispatch({ type: FetchActionType.RequestError, error });
          }
          // return {
          //   loading: false,
          //   data: response,
          //   error: undefined,
          // };
          throw error;
        });
    },
    [request, paramsQuery],
  );

  useEffect(() => {
    // don't auto fetch if lazy
    if (!isLazy) {
      cancelledRef.current = false;
      doFetch().catch(() => {});
    }
    // to avoid race conditions
    return () => {
      if (!isLazy) {
        cancelledRef.current = true;
      }
    };
  }, [doFetch]);

  return [state as FetchState<T>, doFetch];
}

/**
 * A hook to auto call fetch & update state; request will be called if apiParams changes or doFetch is called
 * @param request fetch request; e.g: proxy.Accounting.Controller.Action.Get
 * @param params parameters
 * @returns A request state and function to re-fetch: [state, doFetch]
 * @template const [state, reload] = useFetch(proxy.Api.Get, param1, param2)
 */
export function useFetch<T, P extends unknown[]>(request: (...params: P) => Promise<T>, ...params: P) {
  return _useFetch({ request, params, isLazy: false });
}

/**
 * Same as useFetch, only it's not auto call on apiParams change, have to call doFetch manually
 * @param request fetch request; e.g: proxy.Accounting.Controller.Action.Get
 * @param params parameters
 * @returns A request state and function to re-fetch: [state, doFetch]
 * @template const [state, reload] = useLazyFetch(proxy.Api.Get, param1, param2)
 */
export function useLazyFetch<T, P extends unknown[]>(request: (...params: P) => Promise<T>, ...params: P) {
  return _useFetch({ request, params, isLazy: true });
}

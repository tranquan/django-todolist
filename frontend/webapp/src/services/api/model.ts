export interface SuccessEnvelope<TData> {
  success: true;
  data: TData;
  error: undefined;
  error_message: undefined;
}

export interface ErrorEnvelope<TError> {
  success: false;
  data: undefined;
  error: TError;
  error_message: string | undefined;
}

export type Envelope<TData, TError> = SuccessEnvelope<TData> | ErrorEnvelope<TError>;

export module Todo {
  export interface TodoItem {
    uid: string;
    title: string;
    description: string;
  }
  export interface RequestNewTodoItem {
    title: string;
    description?: string;
  }
}

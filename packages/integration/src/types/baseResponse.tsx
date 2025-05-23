export type BaseResponseType<T> = {
  isError: boolean;
  url: string;
  requestId: string;
  data: T;
};

export default () => {};

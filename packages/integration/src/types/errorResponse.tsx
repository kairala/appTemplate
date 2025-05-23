export type ErrorResponseType = {
  isError: boolean;
  url: string;
  requestId: string;
  statusCode: number;
  message: string;
  error?: string;
  exception?: unknown;
};

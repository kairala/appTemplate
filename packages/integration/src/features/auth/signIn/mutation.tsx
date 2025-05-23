"use client";

import { useMutation } from "@tanstack/react-query";
import { useAxios } from "@workspace/integration/adapters/useAxios";
import { BaseResponseType } from "@workspace/integration/types/baseResponse";
import { ErrorResponseType } from "@workspace/integration/types/errorResponse";
import { AxiosError, AxiosResponse } from "axios";

type Payload = {
  email: string;
  password: string;
};

export type TokensResponse = {
  accessToken: string;
  accessExpiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
};

export const useSignInMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (
    response: AxiosResponse<BaseResponseType<TokensResponse>>
  ) => void;
  onError?: (error: AxiosError<ErrorResponseType>) => void;
}) => {
  const axios = useAxios();

  return useMutation<
    AxiosResponse<BaseResponseType<TokensResponse>>,
    AxiosError<ErrorResponseType>,
    Payload
  >({
    mutationFn: (payload: Payload) => axios.post("/auth/signin", payload),
    onSuccess: (response) => {
      if (onSuccess) {
        onSuccess(response);
      }
    },
    onError: (error) => {
      if (onError) {
        onError(error);
      }
    },
  });
};

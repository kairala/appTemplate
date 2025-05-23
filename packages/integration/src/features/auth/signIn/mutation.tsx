"use client";

import { useMutation } from "@tanstack/react-query";
import { useAxios } from "@workspace/integration/adapters/useAxios.js";
import { TokensResponse } from "@workspace/integration/features/auth/types/tokens.js";
import { BaseResponseType } from "@workspace/integration/types/baseResponse.js";
import { ErrorResponseType } from "@workspace/integration/types/errorResponse.js";
import { AxiosError, AxiosResponse } from "axios";

type Payload = {
  email: string;
  password: string;
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

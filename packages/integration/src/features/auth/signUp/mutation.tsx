"use client";

import { useMutation } from "@tanstack/react-query";
import { useAxios } from "@workspace/integration/adapters/useAxios.js";
import { BaseResponseType } from "@workspace/integration/types/baseResponse.js";
import { ErrorResponseType } from "@workspace/integration/types/errorResponse.js";
import { NoResponse } from "@workspace/integration/types/noResponse.js";

import { AxiosError, AxiosResponse } from "axios";

type Payload = {
  name: string;
  email: string;
  password: string;
};

export const useSignUpMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (response: AxiosResponse<BaseResponseType<NoResponse>>) => void;
  onError?: (error: AxiosError<ErrorResponseType>) => void;
}) => {
  const axios = useAxios();

  return useMutation<
    AxiosResponse<BaseResponseType<NoResponse>>,
    AxiosError<ErrorResponseType>,
    Payload
  >({
    mutationFn: (payload: Payload) => axios.post("/auth/signup", payload),
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

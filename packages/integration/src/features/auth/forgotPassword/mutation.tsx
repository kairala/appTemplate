"use client";

import { useMutation } from "@tanstack/react-query";
import { useAxios } from "@workspace/integration/adapters/useAxios";
import { BaseResponseType } from "@workspace/integration/types/baseResponse";
import { ErrorResponseType } from "@workspace/integration/types/errorResponse";
import { NoResponse } from "@workspace/integration/types/noResponse";
import { AxiosError, AxiosResponse } from "axios";

type Payload = {
  email: string;
};

export const useForgotPasswordMutation = ({
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
    mutationFn: (payload: Payload) =>
      axios.post("/auth/forgot-password", payload),
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

import { useQuery } from "@tanstack/react-query";
import { useAxios } from "@workspace/integration/adapters/useAxios";
import { BaseResponseType } from "@workspace/integration/types/baseResponse";
import { AxiosResponse } from "axios";

export type Plans = "gold" | "platinum" | "free";

export type ShowMeResponseType = {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  plan: Plans;
};

export const buildShowMeQueryKey = () => ["showMe"];

export const useShowMeQuery = () => {
  const axios = useAxios();

  return useQuery<AxiosResponse<BaseResponseType<ShowMeResponseType>>>({
    queryKey: buildShowMeQueryKey(),
    queryFn: () => axios.get(`auth/me`),
    retry: true,
    enabled: true,
  });
};

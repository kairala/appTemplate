import { useQuery } from "@tanstack/react-query";
import { useAxios } from "@workspace/integration/adapters/useAxios.js";
import { BaseResponseType } from "@workspace/integration/types/baseResponse.js";

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

  return useQuery<BaseResponseType<ShowMeResponseType>>({
    queryKey: buildShowMeQueryKey(),
    queryFn: () => axios.get(`auth/me`),
    retry: true,
    enabled: true,
  });
};

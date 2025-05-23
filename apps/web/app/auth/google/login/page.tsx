"use client";

import { ROUTES } from "@/src/config/routes";
import useAuthSession from "@workspace/integration/adapters/authSessionProvider";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GoogleLoginPage() {
  const { setAccessToken, setRefreshToken } = useAuthSession();
  const router = useRouter();

  const searchParams = useSearchParams();
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (accessToken && refreshToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      router.push(ROUTES.HOME);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, refreshToken]);

  return null;
}

"use client";

import { ROUTES } from "@/src/config/routes";
import useAuthSession from "@workspace/integration/adapters/authSessionProvider";
import { useTranslations } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GoogleLoginPage() {
  const t = useTranslations("auth.resetPassword");
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
  }, [accessToken, refreshToken]);

  return null;
}

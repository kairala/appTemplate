"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useConfirmAccountMutation } from "@workspace/integration/features/auth/confirm/mutation";
import { useTranslations } from "next-intl";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { ROUTES } from "@/src/config/routes";
import { useEffect } from "react";

export default function SignUpConfirmPage() {
  const searchParams = useSearchParams();
  const t = useTranslations("auth.confirmAccount");
  const router = useRouter();

  const token = searchParams.get("token");

  const confirmAccountMutation = useConfirmAccountMutation({
    onSuccess: (data) => {
      console.log("data", data);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  useEffect(() => {
    if (token) {
      confirmAccountMutation.mutate({ token });
    }
  }, [token]);

  if (!token) {
    return (
      <div className={cn("grid gap-6")}>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {t("tokenNotFound")}
        </h4>
        <p>{t("tokenNotFoundMessage")}</p>
      </div>
    );
  }

  if (confirmAccountMutation.isPending) {
    return (
      <div className={cn("grid gap-6")}>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {t("loadingTitle")}
        </h4>

        <p>{t("loadingMessage")}</p>
      </div>
    );
  }

  if (confirmAccountMutation.isError) {
    return (
      <div className={cn("grid gap-6")}>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {t("errorTitle")}
        </h4>

        <p>{t("errorMessage")}</p>

        <Button onClick={() => router.push(ROUTES.SIGN_IN)}>
          {t("signIn")}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-6")}>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        {t("successTitle")}
      </h4>
      <p>{t("successMessage")}</p>

      <Button onClick={() => router.push(ROUTES.SIGN_IN)}>{t("signIn")}</Button>
    </div>
  );
}

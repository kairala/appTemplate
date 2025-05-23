"use client";

import { ROUTES } from "@/src/config/routes";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export const SignUpSuccess = () => {
  const t = useTranslations("auth.signUpSuccess");

  const router = useRouter();

  return (
    <div className={cn("grid gap-6")}>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        {t("title")}
      </h4>

      <p>{t("message")}</p>

      <Button variant={"secondary"} onClick={() => router.push(ROUTES.SIGN_IN)}>
        {t("signIn")}
      </Button>
    </div>
  );
};

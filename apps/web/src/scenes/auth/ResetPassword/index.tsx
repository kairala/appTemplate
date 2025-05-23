"use client";

import { ROUTES } from "@/src/config/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPasswordMutation } from "@workspace/integration/features/auth/resetPassword/mutation";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@workspace/integration/features/auth/resetPassword/schema";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
import { cn } from "@workspace/ui/lib/utils";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

export const ResetPassword = () => {
  const router = useRouter();
  const t = useTranslations("auth.resetPassword");

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const resetPasswordMutation = useResetPasswordMutation({
    onSuccess: () => {
      router.push(ROUTES.RESET_PASSWORD_SUCCESS);
    },
    onError: (error) => {
      console.error("Error resetting password:", error);
    },
  });

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ResetPasswordFormData) => {
    if (!token) {
      console.error("Token is required for password reset");
      return;
    }

    resetPasswordMutation.mutate({
      token,
      newPassword: values.password,
    });
  };

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

  return (
    <div className={cn("grid gap-6")}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {t("title")}
          </h4>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("password")}</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("confirmPassword")}</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button>{t("submit")}</Button>
        </form>
      </Form>

      <Separator />

      <Button
        variant={"outline"}
        onClick={() => router.push("/auth/forgot-password")}
        className="w-full"
      >
        {t("signIn")}
      </Button>
    </div>
  );
};

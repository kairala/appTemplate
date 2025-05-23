"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@workspace/integration/features/auth/forgotPassword/schema";
import { useForgotPasswordMutation } from "@workspace/integration/features/auth/forgotPassword/mutation";
import { ROUTES } from "@/src/config/routes";

export const ForgotPassword = () => {
  const router = useRouter();
  const t = useTranslations("auth.forgotPassword");
  const forgotPasswordMutation = useForgotPasswordMutation({
    onSuccess: () => {
      router.push(ROUTES.FORGOT_PASSWORD_SUCCESS);
    },
    onError: (error) => {
      console.error("Error sending forgot password email:", error);
    },
  });

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate({
      email: values.email,
    });
  };

  return (
    <div className={cn("grid gap-6")}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {t("title")}
          </h4>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input {...field} />
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

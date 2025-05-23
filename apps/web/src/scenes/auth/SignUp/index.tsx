"use client";

import { ROUTES } from "@/src/config/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUpMutation } from "@workspace/integration/features/auth/signUp/mutation";
import {
  SignupFormData,
  signupSchema,
} from "@workspace/integration/features/auth/signUp/schema";
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
import { cn } from "@workspace/ui/lib/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export const SignUp = () => {
  const t = useTranslations("auth.signUp");

  const router = useRouter();

  const signUpMutation = useSignUpMutation({
    onSuccess: () => {
      router.push(ROUTES.SIGN_UP_SUCCESS);
    },
    onError: (error) => {
      console.error("Error signing up:", error);
    },
  });

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: SignupFormData) => {
    signUpMutation.mutate({
      email: values.email,
      password: values.password,
      name: values.name,
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("name")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("password")}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
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
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <small className="text-sm font-medium">{t("agree")}</small>
          <Button>{t("submit")}</Button>

          <Button variant={"secondary"}>{t("signIn")}</Button>
        </form>
      </Form>
    </div>
  );
};

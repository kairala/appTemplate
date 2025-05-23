"use client";

import { SignInWithGoogle } from "@/components/SignInWithGoogle";
import { ROUTES } from "@/src/config/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthSession from "@workspace/integration/adapters/authSessionProvider";
import { useSignInMutation } from "@workspace/integration/features/auth/signIn/mutation";
import {
  SigninFormData,
  signinSchema,
} from "@workspace/integration/features/auth/signIn/schema";
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

export const SignIn = () => {
  const router = useRouter();
  const t = useTranslations("auth.signIn");

  const { setAccessToken, setRefreshToken } = useAuthSession();

  const signInMutation = useSignInMutation({
    onSuccess: (response) => {
      const { accessToken, refreshToken } = response.data.data;

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      router.push(ROUTES.HOME);
    },
    onError: (error) => {
      console.error("Error signing in:", error);
    },
  });

  const form = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: SigninFormData) => {
    signInMutation.mutate({
      email: values.email,
      password: values.password,
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

          <Button>{t("submit")}</Button>
        </form>
      </Form>

      <Separator />

      <Button
        variant="link"
        onClick={() => router.push("/auth/forgot-password")}
        className="w-full"
      >
        {t("forgotPassword")}
      </Button>

      <div className="grid gap-4">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {t("noAccount")}
        </h4>

        <Button variant="outline" onClick={() => router.push(ROUTES.SIGN_UP)}>
          {t("signUp")}
        </Button>
      </div>

      <SignInWithGoogle />
    </div>
  );
};

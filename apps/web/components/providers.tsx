"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "@providers/ui/theme-provider";
import { QueryProvider } from "@workspace/integration/adapters/queryProvider";
import { NextIntlClientProvider } from "next-intl";
import { useGetI18nMessages } from "@/src/providers/ui/getI18nMessages";
import { AuthProviderWrapper } from "@/components/auth";

export function Providers({ children }: { children: React.ReactNode }) {
  const { locale, messages } = useGetI18nMessages();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <NextThemesProvider defaultTheme="system">
      <AuthProviderWrapper>
        <QueryProvider>
          <NextIntlClientProvider
            locale={locale}
            messages={messages}
            timeZone={timeZone}
          >
            {children}
          </NextIntlClientProvider>
        </QueryProvider>
      </AuthProviderWrapper>
    </NextThemesProvider>
  );
}

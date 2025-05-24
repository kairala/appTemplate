"use client";

import * as React from "react";
import { QueryProvider } from "@workspace/integration/adapters/queryProvider";
import { AuthProviderWrapper } from "~/providers/auth";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProviderWrapper>
      <QueryProvider>{children}</QueryProvider>
    </AuthProviderWrapper>
  );
}

"use client";

import { AuthProvider } from "@workspace/integration/adapters/authSessionProvider";

const buildKey = (key: string) => {
  if (typeof window === "undefined") {
    return "";
  }

  return `auth:${window.location.origin}:${key}`;
};

export const AuthProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <AuthProvider
      setAccessToken={async (accessToken: string): Promise<boolean> => {
        if (typeof window === "undefined") {
          return false;
        }
        window.localStorage.setItem(buildKey("accessToken"), accessToken);

        return true;
      }}
      setRefreshToken={async (refreshToken: string): Promise<boolean> => {
        if (typeof window === "undefined") {
          return false;
        }

        window.localStorage.setItem(buildKey("refreshToken"), refreshToken);

        return true;
      }}
      getAccessToken={async (): Promise<string | null> => {
        if (typeof window === "undefined") {
          return null;
        }

        return window.localStorage.getItem(buildKey("accessToken"));
      }}
      getRefreshToken={async (): Promise<string | null> => {
        if (typeof window === "undefined") {
          return null;
        }

        return window.localStorage.getItem(buildKey("refreshToken"));
      }}
      logout={async (): Promise<void> => {
        if (typeof window === "undefined") {
          return;
        }

        window.localStorage.removeItem(buildKey("accessToken"));
        window.localStorage.removeItem(buildKey("refreshToken"));
      }}
    >
      {children}
    </AuthProvider>
  );
};

import { AuthProvider } from "@workspace/integration/adapters/authSessionProvider";
import { useRouter } from "expo-router";
import * as SecureStorage from "expo-secure-store";

export const AuthProviderWrapper = ({
  children,
}: {
  children: React.JSX.Element;
}) => {
  const router = useRouter();

  return (
    <AuthProvider
      setAccessToken={async (accessToken: string): Promise<boolean> => {
        await SecureStorage.setItemAsync("accessToken", accessToken);
        return true;
      }}
      setRefreshToken={async (refreshToken: string): Promise<boolean> => {
        await SecureStorage.setItemAsync("refreshToken", refreshToken);
        return true;
      }}
      getAccessToken={async (): Promise<string | null> => {
        return await SecureStorage.getItemAsync("accessToken");
      }}
      getRefreshToken={async (): Promise<string | null> => {
        return await SecureStorage.getItemAsync("refreshToken");
      }}
      logout={async (): Promise<void> => {
        await SecureStorage.deleteItemAsync("accessToken");
        await SecureStorage.deleteItemAsync("refreshToken");
      }}
      onUnauthorized={() => {
        router.dismissTo("/login");
      }}
    >
      {children}
    </AuthProvider>
  );
};

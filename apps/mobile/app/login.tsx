import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";

import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
// import * as AppleAuthentication from "expo-apple-authentication";
// import { useAppleSignInMutation } from "../src/features/auth/useAppleSignin";
// import { Toast } from "toastify-react-native";
import { useColorScheme } from "../lib/useColorScheme";
import useAuthSession from "@workspace/integration/adapters/authSessionProvider";
import {
  signinSchema,
  SigninFormData,
} from "@workspace/integration/features/auth/signIn/schema";
import { useSignInMutation } from "@workspace/integration/features/auth/signIn/mutation";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import Svg, { Path } from "react-native-svg";

export default function Screen() {
  const router = useRouter();
  const { setAccessToken, setRefreshToken, isAuthenticated } = useAuthSession();
  const [googleError, setGoogleError] = React.useState<string | null>(null);
  const { isDarkColorScheme } = useColorScheme();
  // const appleSignin = useAppleSignInMutation({
  //   onSuccess: async (data) => {
  //     await setAccessToken(data.data.accessToken);
  //     await setRefreshToken(data.data.refreshToken);

  //     router.replace("/(tabs)");
  //   },
  //   onError: (error) => {
  //     Toast.error("Erro ao fazer login com Apple");
  //   },
  // });

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signinSchema),
  });

  const signInMutation = useSignInMutation({
    onSuccess: async (data) => {
      await setAccessToken(data.data.data.accessToken);
      await setRefreshToken(data.data.data.refreshToken);

      router.replace("/(tabs)");
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  const onSubmit = (data: SigninFormData) => {
    // Handle authentication
    signInMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  const googleSignIn = async () => {
    try {
      const callbackUrl = Linking.createURL("", { scheme: "template" });

      const signInUrl = new URL(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/google`
      );
      signInUrl.searchParams.set("state", callbackUrl);

      let result = await WebBrowser.openAuthSessionAsync(
        signInUrl.toString(),
        callbackUrl
      );

      if (result.type === "success") {
        const url = new URL(result.url);
        const accessToken = url.searchParams.get("accessToken");
        const refreshToken = url.searchParams.get("refreshToken");
        const error = url.searchParams.get("error");

        if (error) {
          setGoogleError(error);
          return;
        }

        if (!accessToken || !refreshToken) {
          console.error("Missing access token or refresh token");
          return;
        }

        await setAccessToken(accessToken);
        await setRefreshToken(refreshToken);

        router.replace("/(tabs)");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <Text className="text-2xl font-bold mb-4">Entrar</Text>

      <View className="w-full">
        <Label className="pb-2">Email</Label>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="w-full"
              placeholder="Email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && (
          <Text className="text-destructive mt-1">{errors.email.message}</Text>
        )}
      </View>

      <View className="w-full">
        <Label className="pb-2">Senha</Label>

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="w-full"
              placeholder="Senha"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.password && (
          <Text className="text-destructive mt-1">
            {errors.password.message}
          </Text>
        )}
      </View>

      {signInMutation.isError && (
        <Text className="text-destructive mt-1">
          {signInMutation.error?.response?.data?.statusCode === 404
            ? "Usuário não encontrado"
            : signInMutation.error?.response?.data?.statusCode === 401
              ? "Senha incorreta"
              : "Erro ao fazer login"}
        </Text>
      )}

      {googleError && (
        <Text className="text-destructive mt-1">{googleError}</Text>
      )}

      <Button className="w-full mt-2" onPress={handleSubmit(onSubmit)}>
        <Text>Entrar</Text>
      </Button>

      {/* Google Sign In Button */}
      <View className="w-full flex flex-col gap-4 items-center mt-2 my-4">
        <Text className="">ou</Text>

        <TouchableOpacity
          onPress={googleSignIn}
          className="w-[200px] flex-row items-center justify-center bg-white py-3 px-4 rounded-md shadow-sm border border-gray-300"
        >
          <View className="mr-3">
            <View style={{ width: 18, height: 18 }}>
              <Svg viewBox="0 0 48 48" width="100%" height="100%">
                <Path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <Path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <Path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <Path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </Svg>
            </View>
          </View>
          <Text className="text-gray-700 font-medium">Entrar com Google</Text>
        </TouchableOpacity>

        {/* {Platform.OS === "ios" && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={
              AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
            }
            buttonStyle={
              isDarkColorScheme
                ? AppleAuthentication.AppleAuthenticationButtonStyle
                    .WHITE_OUTLINE
                : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
            }
            cornerRadius={5}
            style={{ width: 200, height: 44 }}
            onPress={async () => {
              try {
                const credential = await AppleAuthentication.signInAsync({
                  requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                  ],
                });
                console.log("Apple credential: ", credential);
                console.log(
                  AppleAuthentication.formatFullName(credential.fullName!)
                );
                console.log(credential.email);
                console.log(credential.user);

                appleSignin.mutate({
                  email: credential.email,
                  name: credential.fullName
                    ? AppleAuthentication.formatFullName(
                        credential.fullName,
                        "long"
                      )
                    : null,
                  user: credential.user,
                });
              } catch (err: unknown) {
                if (
                  err &&
                  typeof err === "object" &&
                  "code" in err &&
                  err.code === "ERR_REQUEST_CANCELED"
                ) {
                  console.log("User canceled the sign-in flow");
                  // handle that the user canceled the sign-in flow
                } else {
                  console.error("Error signing in with Apple: ", err);
                }
              }
            }}
          />
        )} */}
      </View>

      <Button
        variant="link"
        onPress={() => router.push("/forgot-password")}
        className="mt-2"
      >
        <Text>Esqueceu a senha?</Text>
      </Button>

      <View className="flex gap-2">
        <Text>Não tem uma conta? </Text>
        <Button onPress={() => router.push("/signup")}>
          <Text>Cadastre-se</Text>
        </Button>
      </View>

      <View className="mt-24 flex items-center">
        <Text
          className="font-semibold"
          onPress={async () => {
            const can = await Linking.canOpenURL(
              "https://www.legendei.io/usageTerms.html"
            );
            if (can) {
              Linking.openURL("https://www.legendei.io/usageTerms.html");
            }
          }}
        >
          Termos de uso
        </Text>
        <Text
          className="font-semibold"
          onPress={async () => {
            const can = await Linking.canOpenURL(
              "https://www.legendei.io/privacy.html"
            );
            if (can) {
              Linking.openURL("https://www.legendei.io/privacy.html");
            }
          }}
        >
          Política de Privacidade
        </Text>
      </View>
    </View>
  );
}

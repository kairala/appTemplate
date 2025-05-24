import React from "react";
import {
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Input } from "~/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "~/components/ui/text";
import { useForgotPasswordMutation } from "@workspace/integration/features/auth/forgotPassword/mutation";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "@workspace/integration/features/auth/forgotPassword/schema";
import { Toast } from "toastify-react-native";
import { Button } from "~/components/ui/button";

export const ForgotPassword = () => {
  const router = useRouter();
  const forgotPasswordMutation = useForgotPasswordMutation({
    onSuccess: () => {
      router.replace("/forgot-password-success");
    },

    onError: () => {
      Toast.error("Erro ao enviar email");
    },
  });

  const isSubmitting = forgotPasswordMutation.isPending;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate({
      email: data.email,
    });
  };
  console.log(forgotPasswordMutation.error?.response?.data);
  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1">
          <View className="flex-1 p-6 justify-center gap-4">
            <View className="mb-8">
              <Text className="text-3xl font-bold text-center ">
                Esqueceu a senha?
              </Text>
              <Text className="text-base text-center mt-2">
                Preencha os campos abaixo para redefinir sua senha
              </Text>
            </View>

            <View className="flex flex-col gap-2">
              <View>
                <Text className="mb-2 font-medium">email</Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      className={`border rounded-lg ${
                        errors.email ? "border-destructive" : "border-secondary"
                      }`}
                      placeholder="Seu email"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  )}
                />
                {errors.email && (
                  <Text className="text-destructive mt-1">
                    {errors.email.message}
                  </Text>
                )}
              </View>

              <View>
                <Button
                  onPress={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator className="text-secondary" />
                  ) : (
                    <Text className="font-bold text-center text-lg">
                      Redefinir Senha
                    </Text>
                  )}
                </Button>

                <Button
                  variant="secondary"
                  className="mt-4"
                  onPress={() => router.back()}
                >
                  <Text className="text-primary text-center">
                    Voltar para o login
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

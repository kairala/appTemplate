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
import { useSignUpMutation } from "@workspace/integration/features/auth/signUp/mutation";
import {
  SignupFormData,
  signupSchema,
} from "@workspace/integration/features/auth/signUp/schema";
import { Button } from "~/components/ui/button";

export const SignUp = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const signupMutation = useSignUpMutation({
    onSuccess: () => router.push("/signup-success"),
  });

  const isSubmitting = signupMutation.isPending;

  const onSubmit = async (data: SignupFormData) => {
    signupMutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

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
                Criar Conta
              </Text>
              <Text className="text-base text-center mt-2">
                Preencha os campos abaixo para se cadastrar
              </Text>
            </View>

            <View className="flex gap-2 pt-8">
              <View>
                <Text className="mb-2 font-medium">Nome completo</Text>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Seu nome completo"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.name && (
                  <Text className="text-destructive mt-1">
                    {errors.name.message}
                  </Text>
                )}
              </View>

              <View>
                <Text className="mb-2 font-medium">Email</Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="seu@email.com"
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
                <Text className="mb-2 font-medium">Senha</Text>
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

              <View>
                <Text className="mb-2 font-medium">Confirmar senha</Text>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Confirme sua senha"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <Text className="text-destructive mt-1">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </View>

              {signupMutation.error?.response?.data?.error && (
                <Text className="text-destructive mt-1">
                  {signupMutation.error.response.data.error}
                </Text>
              )}

              <View className="mt-4 flex gap-4">
                <Button
                  onPress={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator className="text-secondary" />
                  ) : (
                    <Text className="font-bold text-center text-lg">
                      Cadastrar
                    </Text>
                  )}
                </Button>

                <Button
                  variant={"outline"}
                  className="mt-4"
                  onPress={() => router.replace("/")}
                >
                  <Text className="text-center">
                    Já tem uma conta? Faça login
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

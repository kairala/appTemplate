import { View } from "react-native";
import { H1, P } from "~/components/ui/typography";

export const SignUpSuccess = () => {
  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <H1 className="text-2xl font-bold text-center">
        Cadastro realizado com sucesso!
      </H1>
      <P className="text-center">
        Verifique seu email para ativar sua{"\n"} conta e acessar o aplicativo.
      </P>
    </View>
  );
};

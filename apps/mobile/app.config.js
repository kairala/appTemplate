var pjson = require("./package.json");

export default {
  expo: {
    name: "Template",
    slug: "template",
    version: pjson.version,
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "automatic",
    scheme: "template",
    ios: {
      usesAppleSignIn: true,
      supportsTablet: true,
      bundleIdentifier: "br.com.kairala.template",
      config: {
        usesNonExemptEncryption: false,
      },
    },
    android: {
      package: "br.com.kairala.template",
      edgeToEdgeEnabled: true,
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          autoHide: true,
          backgroundColor: "#FFF9CC",
          image: "./assets/images/splash.png",
          resizeMode: "contain",
          imageWidth: 200,
        },
      ],
      [
        "expo-secure-store",
        {
          configureAndroidBackup: true,
          faceIDPermission:
            "Permirtir o uso do Face ID para desbloquear o aplicativo Legendei.",
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "Template usa imagens para podermos gerar legendas para você. Suas fotos serão armazenadas de forma segura e não serão compartilhadas com ninguém.",
          cameraPermission:
            "Template usa a câmera para tirar fotos e podermos gerar legendas para você. Suas fotos serão armazenadas de forma segura e não serão compartilhadas com ninguém.",
        },
      ],
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: "ca-app-pub-9184686440494791~7198467153",
          iosAppId: "ca-app-pub-9184686440494791~5955561886",
        },
      ],
      [
        "expo-web-browser",
        {
          experimentalLauncherActivity: true,
        },
      ],
      [
        "@stripe/stripe-react-native",
        {
          enableGooglePay: true,
        },
      ],
      // [
      //   "@sentry/react-native/expo",
      //   {
      //     url: "https://sentry.io/",
      //     project: "mobile",
      //     organization: "legendei",
      //   },
      // ],
      "expo-apple-authentication",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "<YOUR_PROJECT_ID>",
      },
    },
  },
};

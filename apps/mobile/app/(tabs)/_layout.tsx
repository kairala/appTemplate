import { Tabs } from "expo-router";
import { Platform, View } from "react-native";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Quote } from "~/lib/icons/QuoteIcon";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { adUnits } from "~/components/ads/units";
import { useShowMeQuery } from "@workspace/integration/features/auth/me/query";

export default function TabLayout() {
  const { data: me } = useShowMeQuery();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: true,
        }}
      >
        {/* <Tabs.Screen
          name="history"
          options={{
            title: "",
            headerRight: () => <ThemeToggle />,
            tabBarIcon: ({ focused }) => {
              return (
                <View className="flex items-center justify-center pt-2">
                  <HistoryIcon
                    className={focused ? "text-primary" : "text-foreground"}
                  />
                </View>
              );
            },
          }}
        /> */}

        <Tabs.Screen
          name="index"
          options={{
            title: "",
            headerRight: () => <ThemeToggle />,
            tabBarIcon: ({ focused }) => {
              return (
                <View className="flex items-center justify-center pt-2">
                  <Quote
                    className={focused ? "text-primary" : "text-foreground"}
                  />
                </View>
              );
            },
          }}
        />

        {/* <Tabs.Screen
          name="settings"
          options={{
            title: "",
            headerRight: () => <ThemeToggle />,
            tabBarIcon: ({ focused }) => {
              return (
                <View className="flex items-center justify-center pt-2">
                  <Settings
                    className={focused ? "text-primary" : "text-foreground"}
                  />
                </View>
              );
            },
          }}
        /> */}
      </Tabs>

      {me?.data.data.plan === "free" && (
        <BannerAd
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          unitId={
            __DEV__
              ? TestIds.BANNER
              : Platform.OS === "android"
                ? adUnits.BANNER.ANDROID
                : adUnits.BANNER.IOS
          }
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
            networkExtras: {
              collapsible: "bottom",
            },
          }}
        />
      )}
    </>
  );
}

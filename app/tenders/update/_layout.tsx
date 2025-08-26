import { Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <View className="bg-background flex-1">
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
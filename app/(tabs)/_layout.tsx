import AppBar from "@/components/appBar";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
  return <View className="flex-1 bg-background">
    <Stack screenOptions={{ header: () => <AppBar /> }} />
  </View>;
}

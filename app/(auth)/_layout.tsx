import { icons } from "@/constants/icons";
import { Stack } from "expo-router";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {

  
  return <Stack screenOptions={{ header: () => (
      <SafeAreaView edges={['top']} className="bg-backgroundSec shadow-md">
        <View className="flex-row items-center p-2 justify-start gap-2">
          <Image source={icons.logo} className="w-10 h-10 rounded-full" />
          <Text className="text-xl text-gray-100 font-semibold">
            Tele Tender
          </Text>
        </View>
      </SafeAreaView>)}}>
  </Stack>;
}
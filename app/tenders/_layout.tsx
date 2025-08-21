import { Ionicons } from "@expo/vector-icons";
import { Stack, useNavigation } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const navigation = useNavigation();

  
  return <Stack>
    <Stack.Screen name="[id]" options={{ header: () => (
      <SafeAreaView edges={['top']} className="bg-backgroundSec shadow-md">
        <View className="flex-row items-center p-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 mr-2"
          >
            <Ionicons name="arrow-back" size={24} color="#e5e7eb" />
          </TouchableOpacity>

          <Text className="text-xl font-bold text-gray-200">
            Tender Details
          </Text>
        </View>
      </SafeAreaView>
    )}} />
    <Stack.Screen name="new" options={{ header: () => (
      <SafeAreaView edges={['top']} className="bg-backgroundSec shadow-md">
        <View className="flex-row items-center p-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 mr-2"
          >
            <Ionicons name="arrow-back" size={24} color="#e5e7eb" />
          </TouchableOpacity>

          <Text className="text-xl font-bold text-gray-200">
            New Tender
          </Text>
        </View>
      </SafeAreaView>
    )}} />
  </Stack>;
}
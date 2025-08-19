import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView
      className="text-red-300 flex-1 justify-center items-center bg-background"
    >
      <Text className="text-blue-500 text-3xl">Hallo Tele</Text>
    </SafeAreaView>
  );
}

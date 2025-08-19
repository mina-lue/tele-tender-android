import AppBar from "@/components/appBar";
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="index" options={{ header: () => <AppBar /> }} />
   </Stack>;
}

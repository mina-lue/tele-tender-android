import AppBar from "@/components/AppBar";
import { Stack } from "expo-router";
import './globals.css';

export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="(tabs)/index" options={{ header: () => <AppBar /> }} />
   </Stack>;
}

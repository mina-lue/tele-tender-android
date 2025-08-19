import AppBar from "@/components/appBar";
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack screenOptions={{ header: () => <AppBar /> }} />;
}

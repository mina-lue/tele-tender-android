import AppBar from "@/components/appBar";
import { isLoggedIn } from "@/services/auth.service";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function RootLayout() {
  const router = useRouter();

   useEffect(() => {
  
      const loadAuth = async ()=>{
        const yes = await isLoggedIn();
        if (!yes) router.push('/(auth)/signin');
      }
  
      loadAuth();
    }, [])

  return <View className="flex-1 bg-background">
    <Stack screenOptions={{ header: () => <AppBar /> }} />
  </View>;
}

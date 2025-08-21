import { icons } from '@/constants/icons';
import { User } from '@/lib/domain/user.model';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AppBar = () => {
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const userLoggedIn = await SecureStore.getItemAsync('user');

            setUser(userLoggedIn ? JSON.parse(userLoggedIn) : null);
        };

        fetchUser();
    }, []);


    const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const handleMenuItemPress = (item: '/profile' | '/about' | '/' | '/tenders/new') => {
    router.push(item);
    setMenuVisible(false);
  };

  const handleLogoPress = () => {
    router.push('/');
    setMenuVisible(false);
  };

  return (
    <SafeAreaView edges={['top']} className="bg-backgroundSec shadow-lg">
      <View className="flex-row items-center justify-between p-2 px-4 ">
        <TouchableOpacity onPress={handleLogoPress}>
            <Image source={icons.logo} className="w-10 h-10 rounded-full" />
         </TouchableOpacity>
        
        {/* Hamburger Menu Icon */}
        <View className="relative">
          <TouchableOpacity onPress={toggleMenu} className="pr-2">
            {isMenuVisible ? (
              <Ionicons name="close" size={32} color="#e5e7eb" />
            ) : (
              <Ionicons name="menu" size={32} color="#e5e7eb" />
            )}
          </TouchableOpacity>
          
          {/* Dropdown Menu */}
          {isMenuVisible && (
            <View className="absolute top-12 right-0 w-60 bg-backgroundSec rounded-md shadow-xl py-2 z-50">
              <TouchableOpacity 
                className="p-3 border-b border-gray-500 flex-row"
                onPress={() => handleMenuItemPress('/profile')}
              >
                <Ionicons name="person-outline" size={22} color="#e5e7eb" style={{ marginRight: 12 }} />
                <Text className="text-gray-200">Profile</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="p-3 border-b border-gray-500 flex-row"
                onPress={() => handleMenuItemPress('/about')}
              >
                <Ionicons name="information-circle-outline" size={22} color="#e5e7eb" style={{ marginRight: 12 }} />
                <Text className="text-gray-200">About</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="p-3 border-b border-gray-500 flex-row"
                onPress={() => handleMenuItemPress('/')}
              >
                <Ionicons name="document-text-outline" size={22} color="#e5e7eb" style={{ marginRight: 12 }} />
                <Text className="text-gray-200">Tenders</Text>
              </TouchableOpacity>

              {user?.role === 'BUYER' &&(<TouchableOpacity 
                className="p-3 border-b border-gray-500 flex-row"
                onPress={() => handleMenuItemPress('/tenders/new')}
              >
                <Ionicons name="add-circle-outline" size={22} color="#e5e7eb" style={{ marginRight: 12 }} />
                <Text className="text-gray-200">Post Tender</Text>
              </TouchableOpacity>)}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AppBar
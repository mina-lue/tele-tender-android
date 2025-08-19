import { icons } from '@/constants/icons';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AppBar = () => {
    const [isMenuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const handleMenuItemPress = (item : any) => {
    console.log(`Navigating to ${item}`);
    // Hide the menu after an item is pressed
    setMenuVisible(false);
  };

  return (
    <SafeAreaView edges={['top']} className="bg-backgroundSec shadow-lg">
      <View className="flex-row items-center justify-between p-2 px-4 ">
        <TouchableOpacity>
            <Image source={icons.logo} className="w-10 h-10 rounded-full" />
         </TouchableOpacity>
        
        {/* Hamburger Menu Icon */}
        <View className="relative">
          <TouchableOpacity onPress={toggleMenu} className="pr-2">
            <Ionicons name="menu" size={32} color="#e5e7eb" />
          </TouchableOpacity>
          
          {/* Dropdown Menu */}
          {isMenuVisible && (
            <View className="absolute top-12 right-0 w-60 bg-backgroundSec rounded-md shadow-xl py-2 z-50">
              <TouchableOpacity 
                className="p-3 border-b border-gray-500"
                onPress={() => handleMenuItemPress('Profile')}
              >
                <Text className="text-gray-200">Profile</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="p-3"
                onPress={() => handleMenuItemPress('About')}
              >
                <Text className="text-gray-200">About</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AppBar
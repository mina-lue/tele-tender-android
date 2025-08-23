'use client'
import { icons } from "@/constants/icons";
import { getUser } from "@/services/auth.service";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  note: string;
  amount: string;
}

const PayPage = ({ note, amount }: Props) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true)
    await getUser();
    setLoading(false)
  }


  return (
    <View className="bg-background flex items-center justify-center">
      <View className="flex-col justify-center items-center bg-gray-200 p-4 rounded-lg shadow-md w-80 border-r-blue-500 border-l-green-500 border-x-2">
        <View className="mb-2">
          <Text className="text-green-950 text-xl"> {note} </Text>
        </View>
        <View className="flex items-center justify-center">
          <View className="my-4 flex-row items-center justify-between w-full px-5">
          <Image source={icons.logo} className="w-20 h-20 rounded-full" />
          <Image source={icons.telebirrLogo} className="w-20 h-20" />
          </View>
        </View>
        <TouchableOpacity
          onPress={handlePayment}
          disabled={loading}
          className={`bg-blue-500 p-4 rounded-md mt-2 border-r-blue-600 border-l-background border-x-2 ${loading ? 'opacity-50' : ''}`}
        >
            <Text className="text-white">Pay ETB {amount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PayPage;

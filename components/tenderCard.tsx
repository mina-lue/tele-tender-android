import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  id: number;
  buyer: string;
  details: string;
  openAt: string;
  closeAt: string;
}

const TenderCard = ({ id, buyer, details, openAt, closeAt }: Props) => {
  return (
    <Link href={`/tenders/${id}`} asChild>
      <TouchableOpacity className="bg-[#164B30] rounded-lg shadow-md my-1 p-2">
        <View className="flex-col">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-1 ml-2">
              <FontAwesome name="building" size={24} color="#22c55e" />
              <Text
                className="font-semibold sm:text-xl text-green-600"
                numberOfLines={1}
              >
                {buyer}
              </Text>
            </View>
            <View className="flex-row items-center gap-1 text-sm  mr-2 text-[green-200]">
              <MaterialIcons name="calendar-month" size={16} color="#bbf7d0" />
              <Text className="text-green-200"> closes at </Text>
            </View>
          </View>
          <Text className="text-lg p-2 text-gray-100 ont-inter-regular" numberOfLines={2}>
            {details}
          </Text>
          <View className="flex justify-between items-center">
            <Text className="text-green-200 ml-2 text-xs">{"timeString"}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default TenderCard;

import React from "react";
import { Text, View } from "react-native";

const TenderDetails = () => {
  return (
    <View className="bg-background flex-1 p-4">
      <Text className="text-gray-200 text-2xl">Buyer</Text>
      <View className="flex-col items-end">
          <Text className="text-gray-300 text-sm">
            opens at: 8/15/2025, 6:05:00 PM
          </Text>
          <Text className="text-gray-300 text-sm">
            closes at: 8/15/2025, 6:05:00 PM
          </Text>
        </View>

        
        <Text className="text-gray-300 text-lg mt-4">
          This is a detailed description of the tender, providing all necessary
          information for potential bidders.
        </Text>

        <View className="mt-2 bg-backgroundSec py-2">
            <Text className="text-center text-xl text-gray-300">Get Document</Text>
        </View>
    </View>
  );
};

export default TenderDetails;

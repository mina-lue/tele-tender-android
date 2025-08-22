'use client'
import { Buyer } from "@/lib/domain/buyer.model";
import { fetchBuyer } from "@/services/api";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  id: number;
  buyerId : string;
  details: string;
}

const TenderCard = ({ id, buyerId, details }: Props) => {
  const [buyer, setBuyer] = useState<Buyer | undefined>();

  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const loadBuyer = async () => {
      const buyerData = await fetchBuyer(buyerId);
      setBuyer(buyerData);
    };

    loadBuyer();
  }, [buyerId]);

  const getRelativeTime = () => {
    // Get the current time and the post's update time
    const now = new Date();
    const updatedDate = new Date('2025-08-15T12:05:41.874Z');
    
    // Calculate the difference in milliseconds
    const diffInMilliseconds = now.getTime() - updatedDate.getTime();
    // Convert to seconds
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    // Convert to minutes
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    // Convert to hours
    const diffInHours = Math.floor(diffInMinutes / 60);
    // Convert to days
    const diffInDays = Math.floor(diffInHours / 24);

    // Logic to determine the correct string to display
    if (diffInMinutes < 2) {
      return 'just now';
    } else if (diffInHours < 1) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInDays < 2) {
      return 'yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return `${updatedDate.toLocaleDateString()}`;
    }
  };

  useEffect(() => {
    setTimeString(getRelativeTime());
  }, []); // TODO


  
  return (
    <Link href={`/tenders/${id}`} asChild>
      <TouchableOpacity className="bg-[#164B30] rounded-lg shadow-md my-1 p-2">
        <View className="flex-col">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-1 ml-2">
              <FontAwesome name="building" size={16} color="#22c55e" />
              <Text
                className="font-extrabold text-xl  text-green-600 capitalize"
                numberOfLines={1}
              >
                {buyer?.name}
              </Text>
            </View>
          </View>
          <Text className="text-lg p-2 text-gray-300 first-letter:capitalize" numberOfLines={2}>
            {details}
          </Text>
          <View className="flex justify-end items-center">
            <Text className="text-[#709060] mr-2 text-xs w-full text-right">{timeString}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default TenderCard;

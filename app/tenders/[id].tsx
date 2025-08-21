import { Tender } from "@/lib/domain/tender.model";
import { fetchTenderDetails } from "@/services/api";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

const TenderDetails = () => {
  const {id} = useLocalSearchParams();
  const [tenderLoadingError, setTenderLoadingError] = React.useState<string | null>(null);
  const [tender, setTender] = React.useState<Tender | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    const fetchTender = async () => {
      try {
        setLoading(true);
        const data = await fetchTenderDetails(id as string);
        setTender(data);
      } catch (error) {
        setTenderLoadingError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTender();
  }, [id]);

  return (
    <>
      {tenderLoadingError && <Text className="text-red-500 bg-background flex-1 items-center justify-center">{tenderLoadingError}</Text>}
      {loading && <Text className="text-gray-500 bg-background flex-1 items-center justify-center">Loading...</Text>}

    {tender &&(<View className="bg-background flex-1 p-4">
      <Text className="text-gray-200 text-2xl">Buyer</Text>
      <View className="flex-col items-end">
          <Text className="text-gray-300 text-sm bg-gradient-to-t from-green-800 to-green-900 px-2 py-1">
            opens at: {tender.openAt}
          </Text>
          <Text className="text-gray-300 text-sm bg-gradient-to-t from-green-800 to-green-900 px-2 py-1">
            closes at: {tender.closeAt}
          </Text>
        </View>

        
        <Text className="text-gray-300 text-lg mt-4">
          {tender.details}
        </Text>

        {tender.document_buy_option &&(<View className="mt-2 bg-backgroundSec py-2">
            <Text className="text-center text-xl text-gray-300">Get Document</Text>
        </View>)}
    </View>)}
    </>
  );
};

export default TenderDetails;

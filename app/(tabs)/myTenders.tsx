import { icons } from "@/constants/icons";
import { Tender } from "@/lib/domain/tender.model";
import {
  deleteTender,
  fetchTendersFiltered,
  markTenderAsClosed,
} from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MyTendersPage = () => {
  const [tendersLoading, setTendersLoading] = useState(false);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<"recent" | "DRAFT" | "OPEN" | "CLOSED">("recent");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setTendersLoading(true);
      const tendersFetched = await fetchTendersFiltered(selectedFilter);
      setTenders(tendersFetched);
      setTendersLoading(false);
    };

    fetchData();
  }, [selectedFilter]);

  const handleFilters = async (
    filter: "recent" | "DRAFT" | "OPEN" | "CLOSED"
  ) => {
    setSelectedFilter(filter);
  };

  const handleDelete = async (id: number) => {
    // Show confirmation dialog
    const confirmed = confirm("Are you sure you want to delete this tender?");
    if (!confirmed) return;

    // Call API to delete tender
    await deleteTender(id);

    // Refresh tender list
    const tendersFetched = await fetchTendersFiltered(selectedFilter);
    setTenders(tendersFetched);
  };

  {
    /** handle mark complete function */
  }
  const handleMarkClosed = async (id: number) => {
    // Call API to mark tender as complete
    await markTenderAsClosed(id);

    // Refresh tender list
    const tendersFetched = await fetchTendersFiltered(selectedFilter);
    setTenders(tendersFetched);
  };

  return (
    <View className="flex-1 items-center  bg-background w-full">
      <View className="flex-row gap-2 justify-center my-2">
        <TouchableOpacity
          className={`bg-green-950  px-2 py-1 rounded-md flex-row ${tendersLoading ? "opacity-50" : ""}`}
          onPress={() => handleFilters("recent")}
          disabled={tendersLoading}
        >
          <Text className="capitalize text-gray-300">recent</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`bg-green-950 px-2 py-1 rounded-md flex-row ${tendersLoading ? "opacity-50" : ""}`}
          onPress={() => handleFilters("DRAFT")}
          disabled={tendersLoading}
        >
          <Text className="capitalize text-gray-300">draft</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`bg-green-950 px-2 py-1 rounded-md flex-row ${tendersLoading ? "opacity-50" : ""}`}
          onPress={() => handleFilters("OPEN")}
          disabled={tendersLoading}
        >
          <Text className="capitalize text-gray-300">open</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`bg-green-950 px-2 py-1 rounded-md flex-row ${tendersLoading ? "opacity-50" : ""}`}
          onPress={() => handleFilters("CLOSED")}
          disabled={tendersLoading}
        >
          <Text className="capitalize text-gray-300">closed</Text>
        </TouchableOpacity>
      </View>
      {!tenders && !tendersLoading && (
        <Text className="text-gray-200">No tenders found</Text>
      )}
      {tendersLoading && <Text className="text-gray-200">Loading...</Text>}
      {tenders && (
        <ScrollView
          className="flex-1 pb-12"
          showsVerticalScrollIndicator={false}
        >
            <FlatList
              className="mb-18"
              data={tenders}
              renderItem={({ item }: { item: Tender }) => (
                <View className="bg-[#164B30] p-2 rounded-md mx-2 mb-2">
                  <Text className="text-gray-200 text-lg">
                    {item.details}
                  </Text>

                  <View>
                    <Text className="text-gray-300 text-lg bg-gradient-to-t from-green-800 to-green-900 px-2 py-1">
                      opens at:{" "}
                      {new Date(item.openAt).toLocaleDateString()}{" "}
                      -{" "}
                      {new Date(item.openAt).toLocaleTimeString()}
                    </Text>
                    <Text className="text-gray-300 text-lg bg-gradient-to-t from-green-800 to-green-900 px-2 py-1">
                      closes at:{" "}
                      {new Date(item.closeAt).toLocaleDateString()}{" "}
                      -{" "}
                      {new Date(item.closeAt).toLocaleTimeString()}
                    </Text>
                  </View>

                  <View className="flex items-center m-2">
                    <Image source={icons.logo} width={40} height={40} />
                    <Text className="text-gray-300 text-lg bg-gradient-to-t from-green-800 to-green-900 px-2 py-1">
                      opens at:{" "}
                      {new Date(item.openAt).toLocaleDateString()}{" "}
                      -{" "}
                      {new Date(item.openAt).toLocaleTimeString()}
                    </Text>
                    <Text className="text-gray-300 text-lg bg-gradient-to-t from-green-800 to-green-900 px-2 py-1">
                      closes at:{" "}
                      {new Date(item.closeAt).toLocaleDateString()}{" "}
                      -{" "}
                      {new Date(item.closeAt).toLocaleTimeString()}
                    </Text>
                  </View>

                  {item.documentUrl && (
                    <View className="flex items-center m-2">
                      <Image source={{ uri: item.documentUrl }} width={40} height={40} />
                    </View>
                  )}

                  <View className="flex-row items-center justify-center gap-3">
                    <TouchableOpacity className="bg-green-800 px-2 py-2 rounded-md flex-row" 
                    onPress={() => handleMarkClosed(item.id)}
                    disabled={tendersLoading}
                    >
                      <Ionicons name="checkmark" size={20} color="#d1d5db" />
                      <Text className="capitalize text-gray-300">
                        mark closed
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-red-900 px-2 py-2 rounded-md flex-row gap-1" 
                    onPress={() => handleDelete(item.id)}
                    disabled={tendersLoading}>
                      <Ionicons name="trash" size={20} color="#d1d5db" />
                      <Text className="capitalize text-gray-300">Delete</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-blue-900 px-2 py-2 rounded-md flex-row gap-1" 
                    onPress={() => {router.push(`/tenders/${item.id}`)}}
                    disabled={tendersLoading}>
                      <Ionicons name="eye" size={20} color="#d1d5db" />
                      <Text className="capitalize text-gray-300">View</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-yellow-900 px-2 py-2 rounded-md flex-row gap-1" disabled={tendersLoading}>
                      <Ionicons name="pencil" size={20} color="#d1d5db" />
                      <Text className="capitalize text-gray-300">Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              keyExtractor={(tender) => String(tender.id)}
            scrollEnabled={false}
            ></FlatList>
        </ScrollView>
      )}
    </View>
  );
};

export default MyTendersPage;

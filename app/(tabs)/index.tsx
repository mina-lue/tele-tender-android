import TenderCard from "@/components/tenderCard";
import { fetchTenders } from "@/services/api";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, Text, View } from "react-native";

export default function Index() {

  const [tenders, setTenders] = useState<any>(null);
  const [tendersError, setTendersError] = useState(false);
  const [tendersLoading, setTendersLoading] = useState(false);

 

  useEffect(() => {

    const loadTenders = async ()=>{
      setTendersLoading(false)
      try{
        const tendersLoaded = await fetchTenders();
        setTenders(tendersLoaded);
      } catch (e: any) {
        setTendersError(e.message)
      } finally {
        setTendersLoading(false);
      }
    }

    loadTenders();
  }, [])

  return (
    <View
      className=" flex-1 justify-center items-center bg-background"
    >
      <ScrollView className="flex-1 px-2 "
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: 2, minHeight: "100%" }}
      >
        {tendersLoading && <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />}
        {tendersError && <View className="flex-1 items-center justify-center mt-10"> <Text>Error loading tenders</Text> </View>}
        {tenders && (<FlatList
          data={tenders}
          renderItem={({ item: tender }) => (
            <TenderCard {...tender} buyerId={tender.organizationId} />
          )}
            keyExtractor={(tender) => String(tender.id)}
            className="mt-2 pb-18"
            scrollEnabled={false}
          />)}


      </ScrollView>
    </View>
  );
}

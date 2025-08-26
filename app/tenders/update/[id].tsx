import UpdateTenderComponent from '@/components/updateTender';
import { Tender } from '@/lib/domain/tender.model';
import { fetchTenderDetails } from '@/services/api';
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

const UpdatePage = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [tender, setTender] = useState<Tender | null>(null);

 useEffect(() => {
    if (!id) return;
    fetchTenderDetails(id).then(setTender).catch(console.error);
  }, [id]);

  if (!tender) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <UpdateTenderComponent tender={tender} />;
}

export default UpdatePage
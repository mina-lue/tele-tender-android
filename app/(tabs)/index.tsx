import TenderCard from "@/components/tenderCard";
import { FlatList, ScrollView, View } from "react-native";

export default function Index() {

  const tenders = [
  {
    id: 1,
    details: "this demo tender to be rendered for the first time on the rendered application online.",
    organizationId: 1,
    openAt: "2025-08-14T01:39:00.000Z",
    closeAt: "2025-08-09T04:39:00.000Z",
    document_buy_option: true,
    urlToDoc: "https://res.cloudinary.com/dwvt63sbv/image/upload/v1754692786/qfoebsvaggi2rm2vclau.pdf",
    documentPrice: null,
    status: "OPEN",
    createdAt: "2025-08-08T22:39:50.694Z",
    updatedAt: "2025-08-08T22:39:50.694Z",
    organization: {
      id: 1,
      name: "Minalu Mesele"
    }
  },
  {
    id: 2,
    details: "kkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
    organizationId: 1,
    openAt: "2025-08-11T10:15:00.000Z",
    closeAt: "2025-08-14T10:15:00.000Z",
    document_buy_option: true,
    urlToDoc: "https://res.cloudinary.com/dwvt63sbv/image/upload/v1754723772/aexbhnkdifgdr2pwaa1u.pdf",
    documentPrice: null,
    status: "OPEN",
    createdAt: "2025-08-09T07:16:29.448Z",
    updatedAt: "2025-08-09T07:16:29.448Z",
    organization: {
      id: 1,
      name: "Minalu Mesele"
    }
  },
  {
    id: 3,
    details: "the late update tender listing page has been updated.",
    organizationId: 6,
    openAt: "2025-08-15T15:05:00.000Z",
    closeAt: "2025-08-22T15:05:00.000Z",
    document_buy_option: true,
    urlToDoc: "https://res.cloudinary.com/dwvt63sbv/image/upload/v1755259531/wr0wraxvy9ua3ikxlnr6.pdf",
    documentPrice: "200",
    status: "OPEN",
    createdAt: "2025-08-15T12:05:41.874Z",
    updatedAt: "2025-08-15T12:05:41.874Z",
    organization: {
      id: 6,
      name: "Buyer one"
    }
  },
  {
    id: 4,
    details: "the late update tender listing page has been updated.",
    organizationId: 6,
    openAt: "2025-08-15T15:05:00.000Z",
    closeAt: "2025-08-22T15:05:00.000Z",
    document_buy_option: true,
    urlToDoc: "https://res.cloudinary.com/dwvt63sbv/image/upload/v1755259531/wr0wraxvy9ua3ikxlnr6.pdf",
    documentPrice: "200",
    status: "OPEN",
    createdAt: "2025-08-15T12:05:41.874Z",
    updatedAt: "2025-08-15T12:05:41.874Z",
    organization: {
      id: 6,
      name: "Buyer one"
    }
  },
  {
    id: 5,
    details: "the late update tender listing page has been updated.",
    organizationId: 6,
    openAt: "2025-08-15T15:05:00.000Z",
    closeAt: "2025-08-22T15:05:00.000Z",
    document_buy_option: true,
    urlToDoc: "https://res.cloudinary.com/dwvt63sbv/image/upload/v1755259531/wr0wraxvy9ua3ikxlnr6.pdf",
    documentPrice: "200",
    status: "OPEN",
    createdAt: "2025-08-15T12:05:41.874Z",
    updatedAt: "2025-08-15T12:05:41.874Z",
    organization: {
      id: 6,
      name: "Buyer one"
    }
  },
  {
    id: 6,
    details: "the late update tender listing page has been updated.",
    organizationId: 6,
    openAt: "2025-08-15T15:05:00.000Z",
    closeAt: "2025-08-22T15:05:00.000Z",
    document_buy_option: true,
    urlToDoc: "https://res.cloudinary.com/dwvt63sbv/image/upload/v1755259531/wr0wraxvy9ua3ikxlnr6.pdf",
    documentPrice: "200",
    status: "OPEN",
    createdAt: "2025-08-15T12:05:41.874Z",
    updatedAt: "2025-08-15T12:05:41.874Z",
    organization: {
      id: 6,
      name: "Buyer one"
    }
  },
  {
    id: 7,
    details: "the late update tender listing page has been updated.",
    organizationId: 6,
    openAt: "2025-08-15T15:05:00.000Z",
    closeAt: "2025-08-22T15:05:00.000Z",
    document_buy_option: true,
    urlToDoc: "https://res.cloudinary.com/dwvt63sbv/image/upload/v1755259531/wr0wraxvy9ua3ikxlnr6.pdf",
    documentPrice: "200",
    status: "OPEN",
    createdAt: "2025-08-15T12:05:41.874Z",
    updatedAt: "2025-08-15T12:05:41.874Z",
    organization: {
      id: 6,
      name: "Buyer one"
    }
  },
  {
    id: 8,
    details: "the late update tender listing page has been updated.the late update tender listing page has been updated.the late update tender listing page has been updated.the late update tender listing page has been updated.",
    organizationId: 6,
    openAt: "2025-08-15T15:05:00.000Z",
    closeAt: "2025-08-22T15:05:00.000Z",
    document_buy_option: true,
    urlToDoc: "https://res.cloudinary.com/dwvt63sbv/image/upload/v1755259531/wr0wraxvy9ua3ikxlnr6.pdf",
    documentPrice: "200",
    status: "OPEN",
    createdAt: "2025-08-15T12:05:41.874Z",
    updatedAt: "2025-08-15T12:05:41.874Z",
    organization: {
      id: 6,
      name: "Buyer one"
    }
  }
];

  return (
    <View
      className=" flex-1 justify-center items-center bg-background"
    >
      <ScrollView className="flex-1 px-2 "
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: 2, minHeight: "100%" }}
      >
        <FlatList
          data={tenders}
          renderItem={({ item: tender }) => (
            <TenderCard {...tender} buyer={tender.organization.name} />
          )}
            keyExtractor={(tender) => String(tender.id)}
            className="mt-2 pb-32"
            scrollEnabled={false}
          />
      </ScrollView>
    </View>
  );
}

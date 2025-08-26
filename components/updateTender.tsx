import type { Tender } from "@/lib/domain/tender.model";
import { updateTender } from "@/services/api";
import { AntDesign } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import {
    Alert,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { z } from "zod";

// ---------- Schema ----------
const tenderSchema = z.object({
  details: z.string().min(10, "Details must be at least 10 characters"),
  open_at: z
    .string()
    .refine((v) => !isNaN(Date.parse(v)), { message: "Invalid date" }),
  close_at: z
    .string()
    .refine((v) => !isNaN(Date.parse(v)), { message: "Invalid date" }),
  document_buy_option: z.boolean(),
  status: z.enum(["OPEN", "CLOSED", "DRAFT"]),
});

export type TenderFormData = z.infer<typeof tenderSchema>;

// ---------- Utils ----------
function formatForBackend(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

type DateFieldProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
};

function DateField({ label, value, onChange }: DateFieldProps) {
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [iosShow, setIosShow] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);

  const current = useMemo(
    () => (value ? new Date(value) : new Date()),
    [value]
  );

  const openPicker = () => {
    if (Platform.OS === "android") setShowDate(true);
    else setIosShow(true);
  };

  const onAndroidDateChange = (event: any, selected?: Date) => {
    setShowDate(false);
    if (event?.type === "set" && selected) {
      const d = new Date(selected);
      setTempDate(d);
      setShowTime(true);
    }
  };

  const onAndroidTimeChange = (event: any, selected?: Date) => {
    setShowTime(false);
    if (event?.type === "set" && selected) {
      const t = new Date(selected);
      const base = tempDate || current;
      const combined = new Date(base);
      combined.setHours(t.getHours());
      combined.setMinutes(t.getMinutes());
      onChange(formatForBackend(combined));
      setTempDate(null);
    } else {
      setTempDate(null);
    }
  };

  const onIosChange = (_event: any, selected?: Date) => {
    if (selected) onChange(formatForBackend(selected));
  };

  return (
    <View className="mb-4">
      <Text className="text-base mb-1 font-medium">{label}</Text>
      <Pressable onPress={openPicker} className="border rounded px-3 py-3 bg-white">
        <Text className="text-gray-800">{value || "Select date & time"}</Text>
      </Pressable>

      {Platform.OS === "android" && showDate && (
        <DateTimePicker
          value={current}
          mode="date"
          display="default"
          onChange={onAndroidDateChange}
        />
      )}
      {Platform.OS === "android" && showTime && (
        <DateTimePicker
          value={tempDate || current}
          mode="time"
          display="default"
          onChange={onAndroidTimeChange}
        />
      )}

      {Platform.OS === "ios" && iosShow && (
        <DateTimePicker
          value={current}
          mode="datetime"
          display="spinner"
          onChange={onIosChange}
        />
      )}
    </View>
  );
}

// ---------- Component ----------
type UpdatePageProps = {
  tender: Tender;
  onUpdated?: () => void; // optional callback
};

export default function UpdateTenderComponent({ tender, onUpdated }: UpdatePageProps) {
  const router = useRouter();

  // Prefill states derived from incoming props
  const [fileName, setFileName] = useState<string | null>(null);
  const [urlToDoc, setUrlToDoc] = useState<string | null>(tender.urlToDoc ?? null);
  const [uploading, setUploading] = useState(false);
  const [documentPrice, setDocumentPrice] = useState<string>(tender.documentPrice ?? "");

  const methods = useForm<TenderFormData>({
    resolver: zodResolver(tenderSchema),
    defaultValues: {
      details: tender.details ?? "",
      open_at: tender.openAt ?? formatForBackend(new Date()),
      close_at:
        tender.closeAt ??
        formatForBackend(new Date(Date.now() + 60 * 60 * 1000)),
      document_buy_option: !!tender.document_buy_option,
      status: tender.status ?? "OPEN",
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const docOpt = watch("document_buy_option");

  const pickAndUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        multiple: false,
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.length) return;

      const asset = result.assets[0];
      const fallbackExt = asset.mimeType ? "." + asset.mimeType.split("/")[1] : "";
      const filename = asset.name || `upload${fallbackExt}`;
      setFileName(filename);

      const form = new FormData();
      form.append("file", {
        uri: asset.uri,
        name: filename,
        type: asset.mimeType ?? "application/octet-stream",
      } as any);
      form.append("upload_preset", "tender-app");

      const endpoint = `https://api.cloudinary.com/v1_1/dwvt63sbv/upload`;
      setUploading(true);
      const res = await fetch(endpoint, { method: "POST", body: form });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Upload failed: ${res.status} ${text}`);
      }
      const data = await res.json();
      setUrlToDoc(data.secure_url);
      setUploading(false);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Upload error", err?.message ?? "Failed to upload");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (formData: TenderFormData) => {
    try {
      // If the switch is ON, ensure doc + optional price ready
      if (formData.document_buy_option && !urlToDoc) {
        Alert.alert("Missing document", "Please upload a document first.");
        return;
      }

      const payload: Record<string, any> = {
        // Only send fields the backend expects to update
        details: formData.details,
        open_at: formData.open_at,
        close_at: formData.close_at,
        document_buy_option: formData.document_buy_option,
        status: formData.status,
        ...(formData.document_buy_option ? { urlToDoc } : { urlToDoc: undefined }),
        ...(formData.document_buy_option
          ? { documentPrice: documentPrice || undefined }
          : { documentPrice: undefined }),
      };

      await updateTender(tender.id, payload);

      Alert.alert("Success", "Tender updated successfully.");
      if (onUpdated) onUpdated();
      else router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error?.message ?? "Error updating tender");
    }
  };

  return (
    <ScrollView
      className="flex-1 px-2 bg-background"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: 2, minHeight: "100%" }}
    >
      <FormProvider {...methods}>
        <View className="flex-1 items-center justify-center px-4 py-6">
          <View className="w-full max-w-md rounded-2xl bg-white p-5 shadow">
            <Text className="text-2xl font-extrabold mb-4 text-green-900">
              Update Tender
            </Text>

            {/* Details */}
            <View className="mb-4">
              <Text className="text-base mb-1 font-medium">Details</Text>
              <Controller
                control={control}
                name="details"
                render={({ field: { value, onChange, onBlur} }) => (
                  <TextInput
                    className="border rounded px-3 py-3 bg-white"
                    placeholder="Enter details"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                )}
              />
              {errors.details && (
                <Text className="text-red-500 mt-1">{errors.details.message}</Text>
              )}
            </View>

            {/* Open At */}
            <Controller
              control={control}
              name="open_at"
              render={({ field: { value, onChange } }) => (
                <DateField label="Open At" value={value} onChange={onChange} />
              )}
            />
            {errors.open_at && (
              <Text className="text-red-500 -mt-3 mb-3">
                {errors.open_at.message}
              </Text>
            )}

            {/* Close At */}
            <Controller
              control={control}
              name="close_at"
              render={({ field: { value, onChange } }) => (
                <DateField label="Close At" value={value} onChange={onChange} />
              )}
            />
            {errors.close_at && (
              <Text className="text-red-500 -mt-3 mb-3">
                {errors.close_at.message}
              </Text>
            )}

            {/* Document Buy Option */}
            <View className="flex-row items-center mb-3">
              <Controller
                control={control}
                name="document_buy_option"
                render={({ field: { value, onChange } }) => (
                  <Pressable
                    onPress={() => onChange(!value)}
                    className="flex-row items-center"
                  >
                    {/* simple toggle UI */}
                    <View className={`w-10 h-6 rounded-full mr-2 ${value ? "bg-green-700" : "bg-gray-300"}`}>
                      <View className={`w-5 h-5 rounded-full bg-white mt-0.5 ${value ? "ml-5" : "ml-0.5"}`} />
                    </View>
                    <Text>Document Buy Option</Text>
                  </Pressable>
                )}
              />
            </View>

            {/* Upload + Price when enabled */}
            {docOpt && (
              <View className="mb-4">
                <Pressable
                  onPress={pickAndUpload}
                  disabled={uploading}
                  className={`flex-row items-center justify-center border rounded px-3 py-3 ${uploading ? "opacity-60" : ""}`}
                >
                  <AntDesign name="upload" size={18} style={{ marginRight: 8 }} />
                  <Text>
                    {uploading
                      ? "Uploading..."
                      : urlToDoc
                      ? "Change Document"
                      : "Upload Document"}
                  </Text>
                </Pressable>

                {/* Show current file status */}
                {urlToDoc ? (
                  <Text className="mt-2">
                    Current doc: <Text className="font-semibold">
                      {fileName ?? "Existing document"}
                    </Text>
                  </Text>
                ) : null}

                <View className="mt-3">
                  <Text className="text-base mb-1">Document Price</Text>
                  <TextInput
                    className="border rounded px-3 py-3 bg-white"
                    placeholder="e.g. 25"
                    keyboardType="numeric"
                    value={documentPrice}
                    onChangeText={setDocumentPrice}
                  />
                </View>
              </View>
            )}

            {/* Status */}
            <View className="mb-4">
              <Text className="text-base mb-1 font-medium">Status</Text>
              <Controller
                control={control}
                name="status"
                render={({ field: { value, onChange } }) => (
                  <View className="border rounded">
                    <Picker selectedValue={value} onValueChange={onChange}>
                      <Picker.Item label="Open" value="OPEN" />
                      <Picker.Item label="Closed" value="CLOSED" />
                      <Picker.Item label="Draft" value="DRAFT" />
                    </Picker>
                  </View>
                )}
              />
              {errors.status && (
                <Text className="text-red-500 mt-1">{errors.status.message}</Text>
              )}
            </View>

            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting || uploading}
              className={`w-full rounded px-4 py-3 items-center ${isSubmitting || uploading ? "bg-green-800/60" : "bg-green-800"}`}
            >
              <Text className="text-white font-semibold">
                {isSubmitting ? "Saving..." : uploading ? "Uploading..." : "Update Tender"}
              </Text>
            </Pressable>
          </View>
        </View>
      </FormProvider>
    </ScrollView>
  );
}

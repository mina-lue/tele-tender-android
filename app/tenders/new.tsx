import { createTender } from "@/services/api";
import { getUser, isLoggedIn, User } from "@/services/auth.service";
import { AntDesign } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";

// 📝 Zod schema (strings for dates; backend expects parseable strings)
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

type DateFieldProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
};

function formatForBackend(d: Date) {
  // Use ISO without seconds for readability; still parseable by server
  // e.g. 2025-08-22T10:30
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function DateField({ label, value, onChange }: DateFieldProps) {
  // Android does NOT support mode="datetime" for @react-native-community/datetimepicker.
  // Using two-step (date -> time) flow avoids errors like "cannot read property 'dismiss' of undefined".
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [iosShow, setIosShow] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);

  const current = useMemo(
    () => (value ? new Date(value) : new Date()),
    [value]
  );

  const openPicker = () => {
    if (Platform.OS === "android") {
      setShowDate(true);
    } else {
      setIosShow(true);
    }
  };

  const onAndroidDateChange = (event: any, selected?: Date) => {
    setShowDate(false);
    // event.type: 'set' | 'dismissed'
    if (event?.type === "set" && selected) {
      // Store selected date; then ask for time
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
    // iOS spinner updates continuously; we accept changes immediately
    if (selected) {
      onChange(formatForBackend(selected));
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-base mb-1 font-medium">{label}</Text>
      <Pressable
        onPress={openPicker}
        className="border rounded px-3 py-3 bg-white"
      >
        <Text className="text-gray-800">{value || "Select date & time"}</Text>
      </Pressable>

      {/* ANDROID: two-step pickers */}
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

      {/* iOS: single spinner in-place */}
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

export default function NewTenderScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const loggedIn = await isLoggedIn();
      const userData = loggedIn ? await getUser() : null;
      setUser(userData);
    };
    fetchUser();
  }, []);

  const methods = useForm<TenderFormData>({
    resolver: zodResolver(tenderSchema),
    defaultValues: {
      document_buy_option: false,
      status: "OPEN",
      details: "",
      open_at: formatForBackend(new Date()),
      close_at: formatForBackend(new Date(Date.now() + 60 * 60 * 1000)), // +1h
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const docOpt = watch("document_buy_option");
  const [fileName, setFileName] = useState<string | null>(null);
  const [urlToDoc, setUrlToDoc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [documentPrice, setDocumentPrice] = useState<string>("");

  const pickAndUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        multiple: false,
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.length) return;

      const asset = result.assets[0];
      const fallbackExt = asset.mimeType
        ? "." + asset.mimeType.split("/")[1]
        : "";
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
    if (!user) {
      Alert.alert("Auth required", "You must be logged in to create a tender.");
      return;
    }

    if (formData.document_buy_option && !urlToDoc) {
      Alert.alert("Missing document", "Please upload a document first.");
      return;
    }

    const payload: Record<string, any> = {
      organization_id: Number(user.id),
      details: formData.details,
      open_at: formData.open_at,
      close_at: formData.close_at,
      document_buy_option: formData.document_buy_option,
      status: formData.status,
      ...(formData.document_buy_option ? { urlToDoc } : {}),
      ...(formData.document_buy_option
        ? { documentPrice: documentPrice || undefined }
        : {}),
    };

    try {
      const res = await createTender(payload);

      Alert.alert("Success", "Tender created successfully.");
      
      router.push("/");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error?.message ?? "Error creating tender");
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
              New Tender
            </Text>

            {/* Details */}
            <View className="mb-4">
              <Text className="text-base mb-1 font-medium">Details</Text>
              <Controller
                control={control}
                name="details"
                render={({ field: { value, onChange, onBlur } }) => (
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
                <Text className="text-red-500 mt-1">
                  {errors.details.message}
                </Text>
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
                  <Switch value={value} onValueChange={onChange} />
                )}
              />
              <Text className="ml-2">Document Buy Option</Text>
            </View>

            {/* Upload + Price when enabled */}
            {docOpt && (
              <View className="mb-4">
                <Pressable
                  onPress={pickAndUpload}
                  disabled={uploading}
                  className={`flex-row items-center justify-center border rounded px-3 py-3 ${
                    uploading ? "opacity-60" : ""
                  }`}
                >
                  <AntDesign
                    name="upload"
                    size={18}
                    style={{ marginRight: 8 }}
                  />
                  <Text>
                    {uploading
                      ? "Uploading..."
                      : urlToDoc
                      ? "Change Document"
                      : "Upload Document"}
                  </Text>
                </Pressable>
                {fileName ? (
                  <Text className="mt-2">
                    Selected file:{" "}
                    <Text className="font-semibold">{fileName}</Text>
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
                <Text className="text-red-500 mt-1">
                  {errors.status.message}
                </Text>
              )}
            </View>

            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting || uploading}
              className={`w-full rounded px-4 py-3 items-center ${
                isSubmitting || uploading ? "bg-green-800/60" : "bg-green-800"
              }`}
            >
              <Text className="text-white font-semibold">
                {isSubmitting
                  ? "Submitting..."
                  : uploading
                  ? "Uploading..."
                  : "Create Tender"}
              </Text>
            </Pressable>
          </View>
        </View>
      </FormProvider>
    </ScrollView>
  );
}

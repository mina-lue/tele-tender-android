import { AntDesign } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { buyerSignupSchema, vendorSignupSchema } from "@/lib/schemas/auth";
import { register } from "@/services/api";

const backend_url = process.env.EXPO_PUBLIC_BACKEND_URL as string;
const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string;

// Minimal form type that works for both roles (VENDOR/BUYER)
// If you have VendorSignup / BuyerSignup types, you can replace this with `VendorSignup | BuyerSignup`.
type FormValues = {
  role: "VENDOR" | "BUYER" | "ADMIN";
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  sex?: "male" | "female";
};

const SignupScreen = () => {
  const router = useRouter();
  const [role, setRole] = useState<"VENDOR" | "BUYER" | "ADMIN">("VENDOR");

  const [fileName, setFileName] = useState<string | null>(null);
  const [urlToDoc, setUrlToDoc] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  // Swap schema when role changes
  const schema = useMemo(() => (role === "VENDOR" ? vendorSignupSchema : buyerSignupSchema), [role]);

  // Re-init the form whenever the role changes so the resolver updates
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    defaultValues: { role, sex: "", confirmPassword: "" } as any,
    mode: "onSubmit",
  });

  useEffect(() => {
    reset({ role, sex: "", confirmPassword: "" } as any);
  }, [role, reset]);

  const pickAndUploadDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        multiple: false,
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;

      const asset = result.assets[0];
      const guessedType = asset.mimeType || (asset.name?.endsWith(".pdf") ? "application/pdf" : "image/jpeg");

      setFileName(asset.name ?? asset.uri.split("/").pop() ?? "document");
      setUploading(true);

      const data = new FormData();
      // @ts-ignore — React Native FormData file shape
      data.append("file", {
        uri: asset.uri,
        name: asset.name ?? "upload",
        type: guessedType,
      });
      data.append("upload_preset", 'tender-app');

      const res = await fetch(`https://api.cloudinary.com/v1_1/dwvt63sbv/upload`, {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Upload failed");
      }
      const json = await res.json();
      setUrlToDoc(json.secure_url);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", "Error uploading document");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      // Strip confirmPassword and include urlToDoc & approved
      const { confirmPassword, ...payload } = values as any;
      const updatePayload = { ...payload, urlToDoc, approved: true };

      const res = await register(updatePayload);

      Alert.alert("Success", "Account created successfully.", [
        { text: "OK", onPress: () => router.push("/signin") },
      ]);
    } catch (e: any) {
      console.error(e);
      Alert.alert("Signup failed", e?.message ?? "Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      key={role} // remount on role change so resolver swaps cleanly
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 items-center justify-center px-4 py-8">
          <View className="w-full max-w-md bg-white p-6 rounded-2xl shadow">
            <Text className="text-2xl font-semibold mb-6 text-green-800">Create an Account</Text>

            {/* Role toggle */}
            <View className="flex-row mb-4">
              {["VENDOR", "BUYER"].map((r) => (
                <TouchableOpacity
                  key={r}
                  activeOpacity={0.8}
                  onPress={() => setRole(r as any)}
                  className={`flex-1 py-2 items-center ${
                    role === r ? "border-b-2 border-green-900" : ""
                  }`}
                >
                  <Text className={`${role === r ? "text-green-800 font-medium" : "text-green-900"}`}>
                    {r.charAt(0) + r.slice(1).toLowerCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Role-specific fields */}
            {role === "VENDOR" ? (
              <>
                {/* Name */}
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Name"
                      className="w-full mb-3 p-3 border border-gray-300 rounded-xl text-gray-800"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.name && <Text className="text-red-600 text-sm mb-2">{String(errors.name.message)}</Text>}

                {/* Sex */}
                <Controller
                  control={control}
                  name="sex"
                  render={({ field: { onChange, value } }) => (
                    <View className="w-full mb-3 border border-gray-300 rounded-xl">
                      <Picker selectedValue={value ?? ""} onValueChange={onChange}>
                        <Picker.Item label="Select Sex" value="" />
                        <Picker.Item label="Male" value="male" />
                        <Picker.Item label="Female" value="female" />
                      </Picker>
                    </View>
                  )}
                />
                {/* {errors.sex && <Text className="text-red-600 text-sm mb-2">{String(errors.sex.message)}</Text>} */}

                {/* Phone */}
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Phone"
                      className="w-full mb-3 p-3 border border-gray-300 rounded-xl text-gray-800"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="phone-pad"
                    />
                  )}
                />
                {errors.phone && <Text className="text-red-600 text-sm mb-2">{String(errors.phone.message)}</Text>}
              </>
            ) : (
              <>
                {/* Company/Person Name */}
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Company or Person Name"
                      className="w-full mb-3 p-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 bg-blue-100"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.name && <Text className="text-red-600 text-sm mb-2">{String(errors.name.message)}</Text>}

                {/* Upload Document (PDF / Image) */}
                <View className="mb-3">
                  <TouchableOpacity
                    onPress={pickAndUploadDocument}
                    activeOpacity={0.85}
                    className="flex-row items-center space-x-2 border rounded-xl px-3 py-3"
                    disabled={uploading}
                  >
                    <AntDesign name="upload" size={20} />
                    <Text>
                      {uploading ? "Uploading…" : urlToDoc ? "Change Document" : "Upload Document"}
                    </Text>
                  </TouchableOpacity>
                  {fileName ? (
                    <Text className="text-sm text-gray-800 mt-1">
                      Selected file: <Text className="font-semibold">{fileName}</Text>
                    </Text>
                  ) : null}
                </View>

                {/* Phone */}
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Phone"
                      className="w-full mb-3 p-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 bg-blue-100"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="phone-pad"
                    />
                  )}
                />
                {errors.phone && <Text className="text-red-600 text-sm mb-2">{String(errors.phone.message)}</Text>}
              </>
            )}

            {/* Common Email */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="w-full mb-3 p-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 bg-blue-100"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.email && <Text className="text-red-600 text-sm mb-2">{String(errors.email.message)}</Text>}

            {/* Password */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Password"
                  secureTextEntry
                  className="w-full mb-3 p-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 bg-blue-100"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.password && <Text className="text-red-600 text-sm mb-2">{String(errors.password.message)}</Text>}

            {/* Confirm Password */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Confirm Password"
                  secureTextEntry
                  className="w-full mb-3 p-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 bg-blue-100"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.confirmPassword && (
              <Text className="text-red-600 text-sm mb-2">{String(errors.confirmPassword.message)}</Text>
            )}

            <TouchableOpacity
              disabled={isSubmitting || uploading}
              onPress={handleSubmit(onSubmit)}
              className={`w-full py-3 rounded-xl mt-2 items-center ${
                isSubmitting || uploading ? "bg-green-900/60" : "bg-green-800"
              }`}
              activeOpacity={0.9}
            >
              {isSubmitting ? (
                <View className="flex-row items-center">
                  <ActivityIndicator className="mr-2" />
                  <Text className="text-white">Submitting…</Text>
                </View>
              ) : (
                <Text className="text-white font-medium">Sign Up</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
                      className="mt-4"
                      onPress={() => router.push('/(auth)/signin')}
                    >
                      <Text className="text-center text-blue-400">
                        Already have an account? Sign In
                      </Text>
                    </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


export default SignupScreen;

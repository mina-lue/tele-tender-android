import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const SubscriptionPage = () => {
    const [planLoading, setPlanLoading] = useState(false);

    const handleStartTrial = async () => {
      setPlanLoading(true);
      // Simulate an API call
      setTimeout(() => {
        setPlanLoading(false);
      }, 2000);
    };

  return (
    <View className='flex-1 items-center'>
      <Text>Subscription</Text>
      <View className='w-full h-full flex-col gap-4'>
            <View className="h-80 rounded-2xl p-6 shadow-sm ring-1 ring-gray-00 flex flex-col bg-gray-200">
              <View className="flex-1 justify-center text-center">
                <Text className="text-xl font-bold">Free Trial</Text>
                <Text className="mt-2 text-gray-600">Try our service for free for 14 days.</Text>

              <View className="flex items-center justify-center mt-2 mx-4">
                <View className="h-60 w-60 rounded-full bg-gray-300 flex items-center justify-center shadow-gay-400 shadow-xl">
                <Text className="text-5xl font-bold">ETB 0.00</Text>
                </View>
              </View>

              </View>
                <TouchableOpacity
                  onPress={handleStartTrial}
                  disabled={planLoading}
                  className="mt-6 text-2xl inline-flex items-center justify-center rounded-2xl  bg-gray-300 px-4 py-2.5 shadow-gay-400 shadow-lg transition hover:bg-green-800 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                 <Text>
                    { 
                    planLoading ? "Redirecting…" : 'Subscribe'
                  }
                 </Text>
                </TouchableOpacity>
            </View>

            <View className="h-80 rounded-2xl bg-emerald-800 p-6 ring-1 ring-green-800 flex flex-col h-120 shadow-green-800 shadow-2xl">
              <View className="flex-1 justify-center text-center">
                <Text className="text-xl font-bold text-gray-200">Monthly Pack</Text>
                <Text className="mt-2  text-gray-200">Monthly Recurring Subscription</Text>

              <View className="flex items-center justify-center mt-2 mx-4">
                <View className="h-60 w-60 rounded-full bg-emerald-900 flex items-center justify-center shadow-emerald-950 shadow-xl">
                <Text className="text-5xl text-gray-200 font-bold">ETB 14.00</Text>
                </View>
              </View>

              </View>
                <TouchableOpacity
                  onPress={handleStartTrial}
                  disabled={planLoading}
                  className="mt-6 text-2xl  inline-flex items-center justify-center rounded-2xl bg-emerald-900 shadow-emerald-950 shadow-lg px-4 py-2.5 transition hover:bg-green-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                 <Text className='text-zinc-200'>
                    { 
                    planLoading ? "Redirecting…" : 'Subscribe'
                  }
                 </Text>
                </TouchableOpacity>
            </View>

            <View className="h-80 rounded-2xl bg-amber-600 p-6 ring-1 ring-gold-200 flex flex-col h-120 shadow-amber-800 shadow-2xl">
              <View className="flex-1 justify-center text-center">
                <Text className="text-2xl font-semibold">Yearly pack</Text>
                <Text className="mt-2 text-gray-200 text-md ">Enjoy discounted yearly subscription.</Text>

              <View className="flex items-center justify-center mt-2 mx-4">
                <View className="h-60 w-60 rounded-full bg-amber-700 flex items-center justify-center shadow-amber-800 shadow-xl">
                <Text className="text-5xl text-white font-bold">ETB 140.00</Text>
                </View>
              </View>

              </View>
                <TouchableOpacity
                  onPress={handleStartTrial}
                  disabled={planLoading}
                  className="mt-6 text-2xl font-semibold text-zinc-200 inline-flex items-center justify-center rounded-2xl bg-amber-700 px-4 py-2.5 shadow-amber-800 shadow-md transition hover:bg-green-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                 <Text>
                    { 
                    planLoading ? "Redirecting…" : 'Subscribe'
                  }
                 </Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  )
}

export default SubscriptionPage
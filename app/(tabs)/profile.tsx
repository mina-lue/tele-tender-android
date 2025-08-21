'use client'

import { User } from '@/lib/domain/user.model';
import { getUserData } from '@/services/api';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';



const ProfilePage = () => {

  const [user, setUser] = useState<null | User >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserData();
        setUser(userData);
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <View className='flex-1 items-center justify-center bg-background'>
      {loading && <Text className="text-gray-500">Loading...</Text>}
      {error && <Text className="text-red-500">{error}</Text>}
      {user && (
        <View className="bg-backgroundSec p-4 rounded-lg shadow-lg">
          <Text className="text-gray-200 text-xl font-bold mb-2">{user.name}</Text>
          <Text className="text-gray-300">Email: {user.email}</Text>
          <Text className="text-gray-300">Role: {user.role}</Text>
          <Link href="/(auth)/signin" className="text-blue-500">log out</Link>
        </View>
      )}
    </View>
  )
}

export default ProfilePage;
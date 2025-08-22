import { isLoggedIn, setSession } from '@/services/auth.service';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// This is a simplified version of your schema for demonstration.
// In a real app, you would define this in a shared utility file.
const validateEmail = (email : string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validatePassword = (password : string) => {
  // A simple check for demonstration purposes.
  // In a real app, this should be more robust.
  return password.length >= 6;
};

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  // Handle the sign-in form submission
  const handleSignIn = async () => {
    // Basic client-side validation
    if (!validateEmail(email) || !validatePassword(password)) {
      setAuthError('Please enter a valid email and a password of at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);

    try {
      const response = await fetch('https://tendering-app-be.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Handle API error responses (e.g., 401 Unauthorized)
        const errorData = await response.json();
        setAuthError(errorData.message || 'An authentication error occurred. Please try again.');
        return;
      }
      const data = await response.json();
      console.log('Login successful:', data);


       await setSession({
         accessToken: data.backendTokens.accessToken,
         refreshToken: data.backendTokens.refreshToken,
         expiresAt: data.backendTokens.expiresAt,
         user: {
           id: data.user.id,
           email: data.user.email,
           name: data.user.name,
           role: data.user.role
         }
    });
      router.push('/');
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await isLoggedIn();
      if (loggedIn) {
        router.push('/'); 
      }
    };
    checkAuth();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center p-6">
      <View className="w-full max-w-sm bg-gray-100 p-8 rounded-lg shadow-lg">
        <Text className="text-green-800 text-3xl font-bold mb-6 text-center">
          Welcome Back
        </Text>
        <TextInput
          className="w-full mb-4 p-4 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 bg-blue-100  focus:ring-green-500"
          placeholder="Email"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="w-full mb-6 p-4 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 bg-blue-100  focus:ring-green-500"
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          className={`w-full py-4 rounded-md ${isSubmitting ? 'bg-green-700' : 'bg-green-800'} flex-row items-center justify-center`}
          onPress={handleSignIn}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <View className='flex-row'>
              <Text className='text-white'>Signing in ...</Text>
            </View>
          ) : (
            <Text className="text-white text-lg font-semibold">Sign In</Text>
          )}
        </TouchableOpacity>
        {authError && (
          <Text className="text-red-400 text-sm mt-4 text-center">
            {authError}
          </Text>
        )}
        <TouchableOpacity
          className="mt-4"
          onPress={() => router.push('/(auth)/signup')}
        >
          <Text className="text-center text-blue-400">
            Don&apos;t have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default LoginScreen;
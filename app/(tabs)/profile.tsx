import { Link } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

const profile = () => {
  return (
    <View className='flex-1 items-center justify-center bg-background'>
      <Link href="/(auth)/signin">Login</Link>
    </View>
  )
}

export default profile
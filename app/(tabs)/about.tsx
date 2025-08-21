import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const About = () => {
  return (
    <View className='flex-1 flex items-center justify-center bg-background p-4'>
      <Text className='text-gray-300 text-lg uppercase'>Tele tender application</Text>
      <Text className='text-gray-400 text-md mb-4'>Version 1.0.0</Text>

      <Text className='text-gray-300 text-md mt-2'> This application was brought to you by Hamile trading plc. 
        The application is designed to help Ethiopian vendors have easy access to tenders being made daily from different organizations in Ethiopia.</Text>
      <Text className='text-gray-300 text-md mt-2'>contact developer <Link href={'https://minalu.web.app'} className='text-orange-800'>Minalu Mesele @BIT</Link></Text> 
      <Text className='text-gray-300 text-md mt-2'>© 2025 Hamile trading plc. All rights reserved.</Text>
    </View>
  )
}

export default About
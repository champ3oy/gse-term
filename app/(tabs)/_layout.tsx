import { Stack } from 'expo-router';
import React from 'react';


export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Stack.Screen
        name="stock/[symbol]"
        options={{
          title: 'Stock Details',
          headerShown: false,
        }}
      />
    </Stack>
  );
}

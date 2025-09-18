import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  // custom font
  const [fontsLoaded] = useFonts({
    'Brett': require('@/assets/fonts/BrettTrial-Regular.otf'),
    "Exposure-30": require('@/assets/fonts/ExposureTrial[-30].otf'),
    "Exposure-60": require('@/assets/fonts/ExposureTrial[-60].otf'),
    "Exposure-80": require('@/assets/fonts/ExposureTrial[-80].otf'),
    "Exposure-100": require('@/assets/fonts/ExposureTrial[-100].otf'),
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0f0f' }}>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}

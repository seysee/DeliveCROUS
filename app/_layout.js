import { Stack } from 'expo-router';
import { View } from 'react-native';
import NavigationBar from '../src/components/NavigationBar';

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <NavigationBar />
    </View>
  );
}

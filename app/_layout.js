import { Stack } from "expo-router";
import { View } from "react-native";
import NavigationBar from "../src/components/NavigationBar";
import { AuthProvider } from "../src/context/AuthContext";

export default function Layout() {
    return (
        <AuthProvider>
            <View style={{ flex: 1 }}>
                <Stack screenOptions={{ headerShown: false }} />
                <NavigationBar />
            </View>
        </AuthProvider>
    );
}

import { View, useWindowDimensions, StyleSheet } from "react-native";
import NavigationBar from "../src/components/NavigationBar";
import { AuthProvider } from "../src/context/AuthContext";
import { PanierProvider } from "../src/context/PanierContext";
import { FavoriProvider } from "../src/context/FavoriContext";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";

const MENU_HEIGHT = 60;
const MENU_WIDTH = 200;

export default function Layout() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [fontsLoaded] = useFonts({
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  return (
    <AuthProvider>
      <PanierProvider>
          <FavoriProvider>
      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              marginLeft: isDesktop ? MENU_WIDTH : 0,
              paddingBottom: isDesktop ? 0 : MENU_HEIGHT,
            },
          }}
        />
        <NavigationBar />
      </View>
              </FavoriProvider>
      </PanierProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: "Poppins",
  },
});

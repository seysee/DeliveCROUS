import { Stack } from "expo-router";
import { View, useWindowDimensions, StyleSheet } from "react-native";
import NavigationBar from "../src/components/NavigationBar";
import { useFonts } from "expo-font";

const MENU_HEIGHT = 60;
const MENU_WIDTH = 200;

export default function Layout() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [fontsLoaded] = useFonts({
      Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    });

    if (!fontsLoaded) return null;

  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: "Poppins",
  },
});

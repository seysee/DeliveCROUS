import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { Link, useSegments } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const menuItems = [
  { name: "Accueil", icon: "home", route: "/" },
  { name: "Commandes", icon: "list-alt", route: "/orders" },
  { name: "Favoris", icon: "heart", route: "/favorites" },
  { name: "Compte", icon: "user", route: "/account" },
  { name: "Connexion", icon: "sign-in", route: "/login" }
];

const NavigationBar = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const activeSegment = useSegments()[0];

  return (
    <View style={[styles.container, isDesktop ? styles.desktop : styles.mobile]}>
      {menuItems.map((item) => (
        <Link href={item.route} key={item.name} style={styles.link}>
          <FontAwesome
            name={item.icon}
            size={24}
            color={activeSegment === item.route.replace("/", "") ? "blue" : "gray"}
          />
          <Text style={styles.text}>{item.name}</Text>
        </Link>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "space-around",
  },
  mobile: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 60,
    flexDirection: "row",
    borderTopWidth: 1,
    paddingVertical: 0,
  },
  desktop: {
    left: 0,
    right: 0,
    height: "100%",
    width: 200,
    flexDirection: "column",
    borderRightWidth: 1,
    paddingVertical: 20,
  },
  link: {
    alignItems: "center",
  },
  text: {
    fontSize: 12,
    color: "gray",
  },
});

export default NavigationBar;

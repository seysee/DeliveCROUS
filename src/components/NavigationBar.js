import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { Link, useSegments } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const menuItems = [
  { name: "Accueil", icon: "home", route: "/" },
  { name: "Commandes", icon: "list-alt", route: "/orders" },
  { name: "Favoris", icon: "heart", route: "/favorites" },
  { name: "Compte", icon: "user", route: "/account" },
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
            size={isDesktop ? 18 : 20}
            color={activeSegment === item.route.substring(1) ? "blue" : "black"}
          />
          {isDesktop && <Text style={styles.text}>{item.name}</Text>}
        </Link>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
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
    paddingVertical: 10,
    justifyContent: "space-around",
  },
  desktop: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 200,
    flexDirection: "column",
    borderRightWidth: 1,
    justifyContent: "center",
    paddingVertical: 20,
    alignItems: "center",
  },
  link: {
    alignItems: "center",
    paddingVertical: 10,
  },
  text: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
    fontFamily: "Poppins",
    marginLeft: 8,
  },
});

export default NavigationBar;

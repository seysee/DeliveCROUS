import { View, Text, StyleSheet, useWindowDimensions, Animated, Pressable } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRef, useEffect } from "react";

const menuItems = [
  { name: "Accueil", icon: "home", route: "/" },
  { name: "Commandes", icon: "list-alt", route: "/orders" },
  { name: "Favoris", icon: "heart", route: "/favorites" },
  { name: "Compte", icon: "user", route: "/login" },
];

const NavigationBar = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={[styles.container, isDesktop ? styles.desktop : styles.mobile]}>
      {menuItems.map((item) => (
        <NavItem
          key={item.name}
          item={item}
          isActive={pathname === item.route}
          isDesktop={isDesktop}
          router={router}
        />
      ))}
    </View>
  );
};

const NavItem = ({ item, isActive, isDesktop, router }) => {
  const colorAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(colorAnim, {
      toValue: isActive ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isActive]);

  const handleNavigation = () => {
    router.push(item.route);
  };

  const colorInterpolation = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["black", "#e01020"],
  });

  return (
    <Pressable onPress={handleNavigation} style={[styles.link, isDesktop && styles.desktopLink]}>
      <Animated.Text style={{ color: colorInterpolation }}>
        <FontAwesome5 name={item.icon} size={isDesktop ? 18 : 22} solid />
      </Animated.Text>
      {isDesktop && (
        <Animated.Text
          style={[styles.text,
            {
              color: colorInterpolation,
              fontFamily: isActive ? "Poppins-Bold" : "Poppins-Regular"
            }
          ]}
        >
          {item.name}
        </Animated.Text>
      )}
    </Pressable>
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
    width: 220,
    flexDirection: "column",
    borderRightWidth: 1,
    justifyContent: "center",
    paddingVertical: 20,
    alignItems: "center",
  },
  link: {
    alignItems: "center",
    paddingVertical: 12,
    flexDirection: "row",
  },
  desktopLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 14,
    textAlign: "left",
    fontFamily: "Poppins-Regular",
    marginLeft: 10,
  },
});

export default NavigationBar;
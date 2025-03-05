/**
 * Barre de navigation (NavigationBar).
 *
 * Ce composant fournit une barre de navigation réactive adaptée à la fois pour les écrans mobiles et les écrans de bureau.
 * Il utilise un menu avec plusieurs éléments de navigation tels que "Accueil", "Commandes", "Favoris", et "Compte".
 * La barre de navigation est dynamique et modifie son apparence en fonction de l'écran (mobile ou bureau), de l'état actif des éléments et de la taille de l'écran.
 *
 * **Composants principaux :**
 *
 * 1. **NavigationBar** : Composant principal qui génère la barre de navigation et la structure des éléments de menu.
 *    - Utilise `useWindowDimensions` pour détecter la taille de l'écran et ajuster l'interface en conséquence.
 *    - Utilise `useRouter` et `usePathname` de `expo-router` pour gérer la navigation et la mise en surbrillance des éléments actifs en fonction de l'URL actuelle.
 *    - Le menu est affiché sous forme de liste d'éléments de navigation avec des icônes et des textes dynamiques, qui sont animés lors de leur activation.
 *
 * 2. **NavItem** : Composant de chaque élément de navigation.
 *    - Chaque item utilise `FontAwesome5` pour afficher une icône et un texte associé.
 *    - Lorsque l'élément est actif (c'est-à-dire si l'URL de la page correspond à la route de l'élément), il est mis en surbrillance à l'aide d'une animation.
 *    - Le composant `NavItem` gère les transitions d'animation sur la couleur du texte et de l'icône grâce à `Animated` de React Native.
 *    - Le composant inclut un gestionnaire d'événements `handleNavigation` pour rediriger l'utilisateur vers la route associée à l'élément.
 *
 * **Composants utilisés :**
 * - `View` : Conteneur principal qui structure la barre de navigation.
 * - `Text` : Utilisé pour afficher le texte du menu, comme le nom de la page ou de la section.
 * - `StyleSheet` : Utilisé pour styliser la barre de navigation et les éléments du menu.
 * - `Animated` : Fournit des animations pour l'interpolation de la couleur et des transitions sur les éléments de menu.
 * - `Pressable` : Utilisé pour rendre chaque élément de menu interactif et permettre la navigation.
 * - `FontAwesome5` : Utilisé pour afficher des icônes dans le menu.
 * - `useRouter` et `usePathname` de `expo-router` : Utilisés pour gérer la navigation et les états actifs des éléments.
 *
 * **Fonctionnalité principale :**
 * - Le composant **NavigationBar** contient une liste d'éléments de menu, chaque élément ayant un nom, une icône et une route associée.
 * - Chaque `NavItem` est animé lorsqu'il est actif, avec une transition de couleur entre "noir" et "rouge" pour indiquer l'élément sélectionné.
 * - Le composant est responsive et ajuste son comportement en fonction de la taille de l'écran, passant de la disposition mobile (bas de l'écran) à la disposition de bureau (côte gauche de l'écran).
 */

import { View, Text, StyleSheet, useWindowDimensions, Animated, Pressable } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRef, useEffect } from "react";

const menuItems = [
  { name: "Accueil", icon: "home", route: "/" },
  { name: "Commandes", icon: "list-alt", route: "/panier" },
  { name: "Favoris", icon: "heart", route: "/favoris" },
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
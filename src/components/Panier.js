/**
 * **Composant PanierIcon**
 *
 * Ce composant affiche l'icône du panier ainsi que le nombre d'articles dans le panier. Lorsqu'on clique sur l'icône, l'utilisateur est redirigé vers la page du panier pour voir les articles qu'il a ajoutés.
 *
 * **Fonctionnalités :**
 * 1. **Affichage de l'icône du panier** : Un emoji est affiché pour représenter l'icône du panier.
 * 2. **Badge de notification** : Si le panier contient des articles, un badge rouge avec le nombre d'articles s'affiche sur l'icône du panier.
 * 3. **Liste des articles dans le panier** : Si le panier contient des articles, une liste (`FlatList`) est affichée en dessous de l'icône. Chaque article dans le panier est affiché avec son nom et son prix.
 *
 * **Propriétés et gestion du panier :**
 * - **panier** : La liste des articles ajoutés au panier, obtenue via le hook `usePanier`. Cette liste est affichée sous forme de liste avec les détails de chaque article (nom et prix).
 * - **navigation** : Un objet utilisé pour naviguer entre les différentes pages de l'application (en particulier pour naviguer vers la page du panier lorsque l'icône du panier est cliquée).
 *
 * **Détails de l'implémentation** :
 * 1. **Navigation** : Lorsqu'on clique sur l'icône du panier , la fonction `navigation.navigate('Panier')` est appelée pour rediriger l'utilisateur vers la page du panier.
 * 2. **Affichage conditionnel** :
 *    - Si le panier contient des articles (`panier.length > 0`), un badge est affiché sur l'icône pour indiquer le nombre d'articles.
 *    - Si le panier contient des articles, la liste des articles dans le panier est affichée sous l'icône du panier à l'aide d'une `FlatList`. Chaque article est affiché avec son nom et son prix.

*/
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { usePanier } from "../context/PanierContext";

export default function PanierIcon({ navigation }) {
    const { panier } = usePanier();
    const renderPanierItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.itemText}>{item.name} - {item.price}€</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('Panier')}>
                <Text style={styles.icon}>🛒</Text>
                {panier.length > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{panier.length}</Text>
                    </View>
                )}
            </TouchableOpacity>
            {panier.length > 0 && (
                <FlatList
                    data={panier}
                    renderItem={renderPanierItem}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.panierList}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
    },
    icon: {
        fontSize: 30,
    },
    badge: {
        position: "absolute",
        top: -5,
        right: -5,
        backgroundColor: "red",
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    badgeText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    panierList: {
        marginTop: 10,
        backgroundColor: "#fff",
        padding: 10,
    },
    item: {
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    itemText: {
        fontSize: 14,
    },
});
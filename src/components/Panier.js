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

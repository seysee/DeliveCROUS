import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useFavoris } from "../../src/context/FavoriContext";
import { useRouter } from "expo-router";

export default function FavorisScreen() {
    const { favoris, toggleFavori, loading } = useFavoris();
    const [items, setItems] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch("http://localhost:5000/items");
                if (!response.ok) throw new Error("Erreur de récupération des articles");

                const allItems = await response.json();
                const favorisItems = allItems.filter(item => favoris.includes(item.id));
                setItems(favorisItems);
            } catch (error) {
                console.error("Erreur:", error);
            }
        };

        fetchItems();
    }, [favoris]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff"/>
                <Text style={styles.loadingText}>Chargement des favoris...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mes Favoris</Text>
            {items.length === 0 ? (
                <Text style={styles.emptyMessage}>Aucun favori pour le moment.</Text>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.item} onPress={() => router.push(`/menu/${item.id}`)}>
                            <Image source={{ uri: item.image }} style={styles.image}/>
                            <View style={styles.details}>
                                <Text style={styles.itemText}>{item.name}</Text>
                                <Text style={styles.price}>Prix : <Text style={styles.priceAmount}>{item.price}€</Text></Text>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                            <TouchableOpacity onPress={() => toggleFavori(item.id)} style={styles.removeButton}>
                                <Text style={styles.removeText}>❌</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 30,
        marginLeft: 15,
    },
    title: {
        fontSize: 28,
        fontFamily: "Poppins-Bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#333333"
    },
    emptyMessage: {
        fontSize: 16,
        color: "gray",
        textAlign: "center",
        marginTop: 20,
        fontFamily: "Poppins-Regular"
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#ddd"
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10
    },
    details: {
        flex: 1
    },
    itemText: {
        fontSize: 18,
        fontFamily: "Poppins-Bold",
    },
    price: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
    },
    priceAmount: {
        fontFamily: "Poppins-Medium",
    },
    description: {
        fontSize: 14,
        color: "#666",
        fontFamily: "Poppins-Regular"
    },
    removeButton: {
        padding: 5
    },
    removeText: {
        fontSize: 18,
        color: "red",
        fontFamily: "Poppins-Medium"
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff"
    },
    loadingText: {
        fontFamily: "Poppins-Regular",
        marginTop: 10,
        fontSize: 16,
        color: "#007bff"
    },
});

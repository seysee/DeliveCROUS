/**
 * Le code ci-dessous est responsable de l'affichage des articles favoris de l'utilisateur dans l'application.
 * Il permet de récupérer les articles depuis une API externe, de les filtrer en fonction des favoris
 * stockés dans un contexte global, et d'afficher la liste des articles favoris.
 *
 * Fonctionnalités principales :
 * 1. Récupération des articles via une API (http://localhost:5000/items) à l'aide d'une requête HTTP.
 * 2. Filtrage des articles en fonction des IDs des favoris stockés dans le contexte `FavoriContext`.
 * 3. Affichage des favoris sous forme de liste avec `FlatList` de React Native.
 * 4. Chaque article de la liste comporte une image, un nom, un prix et une description.
 * 5. Les utilisateurs peuvent naviguer vers la page de détail de l'article en appuyant dessus.
 * 6. Les utilisateurs peuvent retirer un article de leurs favoris en appuyant sur une icône de suppression (❌).
 * 7. Un indicateur de chargement (`ActivityIndicator`) est affiché pendant la récupération des données de l'API.
 *
 * Utilisation du contexte FavoriContext :
 * - favoris: Liste des IDs des articles favoris.
 * - toggleFavori: Fonction pour ajouter ou retirer un article des favoris.
 * - loading: Indicateur booléen qui permet d'afficher un message de chargement en attendant la récupération des données.
 *
 * Composants et Hooks utilisés :
 * - useEffect: Utilisé pour exécuter la récupération des articles au démarrage et lorsque la liste des favoris change.
 * - useState: Utilisé pour gérer l'état local des articles récupérés.
 * - useRouter: Utilisé pour la navigation vers la page de détail d'un article.
 * - FlatList: Composant de liste performant pour afficher les favoris.
 */

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useFavoris } from "../../src/context/FavoriContext";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";

export default function FavorisScreen() {
    const { favoris, toggleFavori, loading } = useFavoris();
    const [items, setItems] = useState([]);
    const router = useRouter();
    const { user } = useAuth();

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

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Mes Favoris</Text>
                <Text style={styles.authMessage}>
                    Connecte-toi pour ajouter et voir tes favoris. 🔐
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mes Favoris</Text>
            <Text style={styles.reloadMessage}>N'oublie pas de recharger la page après chaque ajout d'article ! 🔄</Text>

            {items.length === 0 ? (
                <Text style={styles.emptyMessage}>Aucun favori pour le moment...</Text>

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
    },
    title: {
        fontSize: 28,
        fontFamily: "Poppins-Bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#333333"
    },
    emptyMessage: {
        fontSize: 18,
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
    reloadMessage: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        color: "#e01020",
        textAlign: "center",
        marginBottom: 10,
    },
    authMessage: {
        fontSize: 18,
        color: "gray",
        textAlign: "center",
        marginTop: 20,
        fontFamily: "Poppins-Regular"
    },
});
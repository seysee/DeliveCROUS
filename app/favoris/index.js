/**
 * Composant FavorisScreen
 *
 * Ce composant est responsable de l'affichage des articles favoris de l'utilisateur dans l'application.
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
 * - `favoris`: Liste des IDs des articles favoris.
 * - `toggleFavori`: Fonction pour ajouter ou retirer un article des favoris.
 * - `loading`: Indicateur booléen qui permet d'afficher un message de chargement en attendant la récupération des données.
 *
 * Composants et Hooks utilisés :
 * - `useEffect`: Utilisé pour exécuter la récupération des articles au démarrage et lorsque la liste des favoris change.
 * - `useState`: Utilisé pour gérer l'état local des articles récupérés.
 * - `useRouter`: Utilisé pour la navigation vers la page de détail d'un article.
 * - `FlatList`: Composant de liste performant pour afficher les favoris.
 */
import React, {useEffect, useState} from "react";
import {View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator} from "react-native";
import {useFavoris} from "../../src/context/FavoriContext";
import {useRouter} from "expo-router";

export default function FavorisScreen() {
    const {favoris, toggleFavori, loading} = useFavoris();
    const [items, setItems] = useState([]);
    const router = useRouter();

    // Récupère les articles favoris depuis l'API
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

    // Affiche un loader pendant le chargement des favoris
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff"/>
                <Text>Chargement des favoris...</Text>
            </View>
        );
    }
    // Affiche les favoris ou un message si aucun favori
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mes Favoris</Text>
            {items.length === 0 ? (
                <Text style={styles.emptyMessage}>Aucun favori pour le moment.</Text>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({item}) => (
                        <TouchableOpacity style={styles.item} onPress={() => router.push(`/menu/${item.id}`)}>
                            <Image source={{uri: item.image}} style={styles.image}/>
                            <View style={styles.details}>
                                <Text style={styles.itemText}>{item.name}</Text>
                                <Text style={styles.price}>{item.price}€</Text>
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
    container:
        {
            flex: 1,
            padding: 20,
            backgroundColor: "#fff"
        },
    title:
        {
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 10
        },
    emptyMessage:
        {
            fontSize: 16,
            color: "gray",
            textAlign: "center",
            marginTop: 20
        },
    item:
        {
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            borderBottomWidth: 1,
            borderColor: "#ddd"
        },
    image:
        {
            width: 80,
            height: 80,
            borderRadius: 10,
            marginRight: 10
        },
    details:
        {
            flex: 1
        },
    itemText:
        {
            fontSize: 18,
            fontWeight: "bold"
        },
    price:
        {
            fontSize: 16,
            color: "#007bff"
        },
    description:
        {
            fontSize: 14,
            color: "#666"
        },
    removeButton:
        {
            padding: 5
        },
    removeText:
        {
            fontSize: 18,
            color: "red"
        },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff"
    },
});
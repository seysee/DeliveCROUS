/**
 *
 * Cette page affiche un menu dynamique sous forme de liste de plats (ou articles) récupérés à partir d'une API. Elle utilise une `FlatList` pour rendre les éléments du menu, et ajuste le nombre de colonnes en fonction de la largeur de l'écran. La page est conçue pour s'adapter aux différentes tailles d'écran (responsive).
 *
 * **Composants principaux :**
 *
 * 1. **Page** : Composant principal qui gère l'affichage du menu. Il récupère les plats depuis une API, les stocke dans un état local, puis les rend à l'aide d'une `FlatList`.
 *    - La largeur de l'écran est utilisée pour déterminer le nombre de colonnes à afficher dans le menu : 2 colonnes pour les petits écrans, 3 colonnes pour les écrans plus larges.
 *    - Le contenu est enveloppé dans des contextes (`AuthProvider`, `PanierProvider`, `FavoriProvider`) afin de gérer l'authentification, le panier et les favoris de l'utilisateur.
 *
 * 2. **FlatList** : Composant utilisé pour rendre la liste des plats dans un format de grille. Il permet un rendu efficace des éléments, même lorsque la liste est longue.
 *    - Le nombre de colonnes est déterminé dynamiquement en fonction de la largeur de l'écran (réactivité).
 *    - Les éléments de la liste sont rendus à l'aide du composant `ItemCard`, qui est responsable de l'affichage de chaque plat.
 *
 * **Détails d'implémentation :**
 * - `useState` est utilisé pour stocker les plats récupérés depuis l'API dans un état local.
 * - `useEffect` est utilisé pour effectuer la requête API au moment où la page est rendue. Les données sont récupérées depuis l'API et stockées dans l'état local (`dishes`).
 * - `SafeAreaView` est utilisé pour garantir que le contenu de la page n'est pas masqué par les bords de l'écran, notamment sur les appareils avec des encoches ou des coins arrondis.
 * - La largeur de l'écran est récupérée à l'aide de `useWindowDimensions` pour déterminer combien de colonnes doivent être affichées dans la grille.
 *
 * **Composants de Contexte :**
 * - `AuthProvider` : Fournit l'authentification à l'ensemble de l'application.
 * - `PanierProvider` : Fournit le contexte lié au panier de l'utilisateur (ajouter, supprimer des articles).
 * - `FavoriProvider` : Fournit le contexte lié aux articles favoris de l'utilisateur.
 *
 * **Gestion de la Réactivité :**
 * - La variable `numColumns` est ajustée en fonction de la largeur de l'écran. Elle définit le nombre de colonnes de la grille : 2 colonnes pour les écrans moyens et 3 colonnes pour les écrans plus larges (comme les ordinateurs de bureau).
 *
 * **API utilisée :**
 * - Les plats sont récupérés depuis une API en local (localhost:5000/items). La réponse de l'API est stockée dans un tableau d'objets, qui est ensuite utilisé pour rendre chaque plat dans la liste.
 *
 */

import { View, Text, FlatList, StyleSheet, SafeAreaView, useWindowDimensions, Platform } from "react-native";
import ItemCard from "../src/components/ItemCard";
import { AuthProvider } from "@/src/context/AuthContext";
import { useEffect, useState } from "react";
import { PanierProvider } from "@/src/context/PanierContext";
import { FavoriProvider } from "@/src/context/FavoriContext";


export default function Page() {
    const [dishes, setDishes] = useState([]);
    const { width } = useWindowDimensions();

    let numColumns = 2;
    if (width >= 1200) {
        numColumns = 3;
    } else if (width >= 800) {
        numColumns = 2;
    }

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const response = await fetch("http://localhost:5000/items");
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des plats");
                }
                const data = await response.json();
                setDishes(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des plats:", error);
            }
        };

        fetchDishes();
    }, []);

    return (
        <AuthProvider>
            <PanierProvider>
                <FavoriProvider>
                <SafeAreaView style={styles.safeContainer}>
                    <View style={styles.container}>
                        <Text style={styles.title}>Menu</Text>
                        <FlatList
                            key={`numColumns-${numColumns}`} //
                            data={dishes}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => <ItemCard item={item} />}
                            numColumns={numColumns}
                            columnWrapperStyle={Platform.OS === 'web' ? styles.row : null}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </SafeAreaView>
                    </FavoriProvider>
            </PanierProvider>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    row: {
        justifyContent: "space-between",
    },
    listContainer: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
});

/**
 * ItemCard : Composant représentant une carte d'élément (produit, plat, etc.) affichée dans une liste ou une grille.
 * Ce composant affiche les informations d'un article, telles que son image, son nom, son prix, une courte description, et inclut des boutons pour l'ajouter au panier ou le marquer comme favori.
 *
 * Fonctionnalités principales :
 * 1. Affichage des détails de l'article :
 *    - L'image, le nom, le prix et la description de l'élément sont affichés dans une carte avec un style visuellement agréable.
 * 2. Navigation vers une page de détails :
 *    - Lorsqu'un utilisateur appuie sur l'élément, il est redirigé vers une page de détails de l'article.
 * 3. Gestion du panier :
 *    - Les utilisateurs peuvent ajouter ou supprimer l'article du panier, et le bouton correspondant reflète l'état actuel (ajouté ou non).
 * 4. Gestion des favoris :
 *    - Les utilisateurs peuvent ajouter ou retirer l'article de leurs favoris, et l'état du bouton est mis à jour en fonction de l'article favori.
 *
 * Composants utilisés :
 * - `useWindowDimensions` : Permet d'adapter la largeur de la carte en fonction de la taille de l'écran de l'appareil.
 * - `useRouter` : Utilisé pour naviguer vers la page de détails de l'élément lorsqu'il est cliqué.
 * - `FavoriButton` et `PanierButton` : Composants personnalisés qui permettent de gérer les interactions avec les favoris et le panier.
 *
 * Props :
 * - `item` : Un objet représentant un élément, qui contient des informations comme l'id, le nom, la description, l'image, le prix, etc.
 *
 * État dynamique :
 * - `inCart` : Détermine si l'élément est actuellement dans le panier de l'utilisateur.
 * - `isFavorited` : Indique si l'élément est actuellement favori pour l'utilisateur.
 *
 * Utilisation de contextes :
 * - `usePanier` : Permet de gérer l'état du panier, y compris l'ajout et la suppression d'éléments.
 * - `useFavoris` : Permet de gérer l'état des favoris, avec une fonction pour ajouter ou retirer un élément des favoris.
*/

import { View, Text, Image, TouchableOpacity, StyleSheet, useWindowDimensions, Modal } from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import FavoriButton from "../components/FavoriteButton";
import PanierButton from "../components/PanierButton";
import { usePanier } from "../context/PanierContext";
import { useFavoris } from "../context/FavoriContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import CustomModal from './CustomModal';

export default function ItemCard({ item }) {
    const router = useRouter();
    const { panier, ajouterAuPanier, supprimerDuPanier } = usePanier();
    const { favoris, toggleFavori } = useFavoris();
    const { width } = useWindowDimensions();
    const numColumns = width < 600 ? 2 : width < 760 ? 3 : 4;
    const cardWidth = width / numColumns - 10;
    const [modalVisible, setModalVisible] = useState(false);
    const descriptionPreview = item.description.length > 30 ? item.description.substring(0, 30) + "..." : item.description;
    const inCart = panier.some(panierItem => panierItem.id === item.id);
    const isFavorited = favoris.includes(item.id);
    const { user } = useAuth();

    const toggleInCart = () => {
        if (!user || !user.id) {
            setModalVisible(true);
            return;
        }
        if (inCart) {
            supprimerDuPanier(item.id);

        } else {
            ajouterAuPanier({ itemId: item.id, quantite: 1 });
        }
    };

    const toggleInFavoris = () => {
        if (!user || !user.id) {
            setModalVisible(true);
            return;
        }
        toggleFavori(item.id);
    };

    const [fontsLoaded] = useFonts({
        "Poppins-Thin": require("../../assets/fonts/Poppins-Thin.ttf"),
        "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <>
            <TouchableOpacity
                style={[styles.card, { width: cardWidth }]}
                onPress={() => router.push(`/menu/${item.id}`)}
                accessibilityLabel={`Voir le plat ${item.name}`}
            >
                <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    onError={() => console.log("Image non trouvée")}
                />
                <View style={styles.titleContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.price}>{item.price} €</Text>
                </View>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description} numberOfLines={1}>{descriptionPreview}</Text>
                    <PanierButton inCart={inCart} toggleInCart={toggleInCart} />
                    <FavoriButton isFavorited={isFavorited} toggleIsFavorited={toggleInFavoris} />
                </View>
            </TouchableOpacity>
            <CustomModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                title="Connexion requise"
                message="Vous devez être connecté(e) pour ajouter un article au panier ou aux favoris."
            />
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        marginHorizontal: 5,
        alignItems: "center",
        elevation: 3,
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    image: {
        width: "100%",
        height: 120,
        borderRadius: 10,
        marginBottom: 8,
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 5,
    },
    name: {
        fontSize: 16,
        fontFamily: "Poppins-Bold",
        flexShrink: 1
    },
    price: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#e01020"
    },
    descriptionContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 5,
    },
    description: {
        fontSize: 12,
        fontFamily: "Poppins-Regular",
        color: "#666",
        flex: 1,
        marginRight: 8
    },
});

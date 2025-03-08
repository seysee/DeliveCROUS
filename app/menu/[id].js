/**
 * Cette page affiche les détails d'un plat sélectionné, y compris son nom, son prix,
 * sa description, ses allergènes et une image associée. Elle permet également
 * de revenir à la page précédente et de voir des plats similaires suggérés.
 *
 * - Utilise `useLocalSearchParams` de `expo-router` pour récupérer l'ID de l'élément sélectionné.
 * - Récupère les données de l'élément via un appel API à `http://localhost:5000/items/{id}`.
 * - Récupère des éléments liés à la même catégorie que le plat actuel via un autre appel API.
 * - Affiche les allergènes sous forme de liste et gère le cas où il n'y en a pas.
 * - Affiche un indicateur de chargement lors de la récupération des données.
 * - En cas d'erreur, un message d'erreur est affiché à l'utilisateur.
 * - Affiche une liste horizontale de plats similaires (plutôt que de simplement lister les plats).
 *
 * Composants :
 * - PanierButton : Permet à l'utilisateur d'ajouter l'élément au panier.
 * - FavoriButton : Permet à l'utilisateur d'ajouter l'élément aux favoris.
 * - ItemCard : Affiche un plat suggéré dans une carte de manière horizontale dans la section "Plats Suggérés".
 *
 */

import { useEffect, useState, useMemo } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ScrollView, ActivityIndicator, useWindowDimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import PanierButton from "@/src/components/PanierButton";
import FavoriButton from "@/src/components/FavoriteButton";
import ItemCard from "../../src/components/ItemCard";
import { useFonts } from "expo-font";
import { useAuth } from "../../src/context/AuthContext";
import CustomModal from '../../src/components/CustomModal';

export default function ItemDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { width } = useWindowDimensions();
    const { user } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);

    const [fontsLoaded] = useFonts({
        "Poppins-Thin": require("../../assets/fonts/Poppins-Thin.ttf"),
        "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
    });

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedItems, setRelatedItems] = useState([]);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await fetch(`http://localhost:5000/items/${id}`);
                if (!response.ok) throw new Error("Plat introuvable");

                const data = await response.json();
                setItem(data);

                const relatedResponse = await fetch(`http://localhost:5000/items?categorie=${data.categorie}`);
                const relatedData = await relatedResponse.json();
                setRelatedItems(relatedData.filter(dish => dish.id !== id));

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    const displayedRelatedItems = useMemo(() => relatedItems.slice(0, 3), [relatedItems]);

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#e01020" style={styles.loader} />;
    }

    if (loading) {
        return <ActivityIndicator size="large" color="#e01020" style={styles.loader} />;
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    const handleButtonPress = () => {
        if (!user || !user.id) {
            console.log('Modal affiche toi');
            setModalVisible(true);
        }
    };

    return (
        <>
            <ScrollView style={[styles.container, width >= 1200 && { marginLeft: 20 }]} contentContainerStyle={styles.contentContainer}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>← Retour</Text>
                </TouchableOpacity>

                <Image source={{ uri: item.image }} style={styles.image} />

                <View style={styles.details}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.name}>{item.name}</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={handleButtonPress}>
                                <PanierButton />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleButtonPress}>
                                <FavoriButton />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.price}>{item.price}€</Text>
                    <Text style={styles.description}>{item.description}</Text>

                    <Text style={styles.allergenTitle}>Allergènes</Text>
                    <View style={styles.allergenContainer}>
                        {item.allergens.length > 0 ? (
                            item.allergens.map((allergen, index) => (
                                <View key={index} style={styles.allergenTag}>
                                    <Text style={styles.allergenText}>{allergen}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noAllergenText}>Aucun</Text>
                        )}
                    </View>
                </View>

                <Text style={styles.suggestedTitle}>Plats Suggérés</Text>
                <FlatList
                    data={displayedRelatedItems}
                    horizontal
                    keyExtractor={(dish) => dish.id.toString()}
                    renderItem={({ item }) => <ItemCard item={item} cardWidth={width * 0.4} />}
                    contentContainerStyle={styles.suggestedContainer}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    showsHorizontalScrollIndicator={false}
                />
            </ScrollView>

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
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 30,
        paddingRight: 20,
    },
    contentContainer: {
        paddingBottom: 40,
    },
    backButton: {
        marginBottom: 15,
    },
    backText: {
        fontSize: 18,
        color: "#e01020",
        fontFamily: "Poppins-Bold",
    },
    image: {
        width: "100%",
        height: 250,
        borderRadius: 10,
        marginBottom: 20,
    },
    details: {
        marginTop: 10,
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 10,
    },
    name: {
        fontSize: 24,
        fontFamily: "Poppins-Bold",
        flexShrink: 1,
    },
    price: {
        fontSize: 20,
        color: "#e01020",
        fontFamily: "Poppins-Medium",
        marginVertical: 5,
    },
    description: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        color: "#555",
        marginBottom: 15,
    },
    allergenTitle: {
        fontSize: 18,
        fontFamily: "Poppins-Bold",
        marginTop: 15,
        marginBottom: 5,
    },
    allergenContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    allergenTag: {
        backgroundColor: "#ffebee",
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 12,
    },
    allergenText: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#d32f2f",
    },
    noAllergenText: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        color: "#777",
    },
    suggestedTitle: {
        fontSize: 20,
        fontFamily: "Poppins-Bold",
        marginTop: 30,
        marginBottom: 10,
    },
    suggestedContainer: {
        flexDirection: "row",
        paddingRight: 15,
    },
    separator: {
        width: 10,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        fontSize: 18,
        color: "red",
        fontFamily: "Poppins-Medium",
        textAlign: "center",
    },
});
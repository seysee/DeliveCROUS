import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import FavoriButton from "../components/FavoriteButton";
import PanierButton from "../components/PanierButton";

const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth / 2 - 30;

export default function ItemCard({ item }) {
    const router = useRouter();
    const [isFavorited, setIsFavorited] = useState(false);
    const [inCart, setInCart] = useState(false);

    // couper la description à 30 caractères maximum et ajouter "..."
    const descriptionPreview = item.description.length > 30 ? item.description.substring(0, 30) + "..." : item.description;

    return (
        <TouchableOpacity style={styles.card} onPress={() => router.push(`/menu/${item.id}`)}>
            <Image source={item.image} style={styles.image} />

            {/* Titre & Prix */}
            <View style={styles.titleContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>{item.price}</Text>
            </View>

            {/* Description & Icons */}
            <View style={styles.descriptionContainer}>
                <Text style={styles.description} numberOfLines={1}>{descriptionPreview}</Text>

                {/* Utilisation des composants PanierButton et FavoriButton */}
                <PanierButton inCart={inCart} toggleInCart={() => setInCart(!inCart)} />
                <FavoriButton isFavorited={isFavorited} toggleIsFavorited={() => setIsFavorited(!isFavorited)} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: cardWidth,
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        alignItems: "center",
        elevation: 2,
    },
    image: {
        width: "100%",
        height: 120,
        borderRadius: 10,
        marginBottom: 8
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 5,
    },
    name: { fontSize: 16, fontWeight: "bold" },
    price: { fontSize: 14, color: "gray" },
    descriptionContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 5,
    },
    description: { fontSize: 12, color: "#666", flex: 1, marginRight: 8 },
    iconButton: {
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    },
});


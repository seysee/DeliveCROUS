import { View, Text, Image, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import FavoriButton from "../components/FavoriteButton";
import PanierButton from "../components/PanierButton";

export default function ItemCard({ item, onFavoriteToggle, isFavorited }) {
    const router = useRouter();
    const [inCart, setInCart] = useState(false);
    const { width } = useWindowDimensions();
    const numColumns = width < 600 ? 2 : width < 760 ? 3 : 4;
    const cardWidth = width / numColumns - 10;

    const descriptionPreview = item.description.length > 30 ? item.description.substring(0, 30) + "..." : item.description;

    return (
        <TouchableOpacity
            style={[styles.card, { width: cardWidth }]}
            onPress={() => router.push(`/menu/${item.id}`)}
            accessibilityLabel={`Voir le plat ${item.name}`}
        >
            <Image
                source={{ uri: item.image }}
                style={styles.image}
                onError={(e) => console.log("Image non trouvée", e.nativeEvent.error)}
            />
            <View style={styles.titleContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>{item.price}</Text>
            </View>
            <View style={styles.descriptionContainer}>
                <Text style={styles.description} numberOfLines={1}>{descriptionPreview}</Text>
                <PanierButton inCart={inCart} toggleInCart={() => setInCart(!inCart)} />
                <FavoriButton isFavorited={isFavorited} toggleIsFavorited={() => onFavoriteToggle(item.id)} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        marginHorizontal: 5,
        alignItems: "center",
        elevation: 2,
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
});



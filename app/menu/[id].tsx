import { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ItemCard from "../../src/components/ItemCard";
import PanierButton from "@/src/components/PanierButton";
import FavoriButton from "@/src/components/FavoriteButton";

const dishes = [
    {
        id: "1",
        name: "Pâtes Bolognaise",
        price: "10€",
        image: require("../../assets/images/spaghetti.jpg"),
        description: "Les pâtes fraîches, cuites al dente, sont servies avec une sauce bolognaise maison...",
        allergens: ["Gluten", "Lait", "Œufs"],
    },
    {
        id: "2",
        name: "Salade de fruits",
        price: "8€",
        image: require("../../assets/images/fruits.jpg"),
        description: "Cette salade de fruits frais est un véritable concentré de vitamines et de fraîcheur...",
        allergens: ["Aucun"],
    },
    {
        id: "3",
        name: "Viande grillée",
        price: "12€",
        image: require("../../assets/images/meat.jpg"),
        description: "Cette viande grillée est un véritable délice pour les amateurs de grillades...",
        allergens: ["Aucun"],
    },
    {
        id: "4",
        name: "Maïs grillé",
        price: "7€",
        image: require("../../assets/images/corn.jpg"),
        description: "Ce maïs grillé est une spécialité simple mais pleine de saveurs...",
        allergens: ["Lait"],
    },
    {
        id: "5",
        name: "Tarte aux pommes",
        price: "6€",
        image: require("../../assets/images/apple-pie.jpg"),
        description: "Cette tarte aux pommes est un dessert traditionnel réconfortant...",
        allergens: ["Gluten", "Lait", "Œufs"],
    },
    {
        id: "6",
        name: "Crème brûlée",
        price: "5€",
        image: require("../../assets/images/creme-brulee.jpg"),
        description: "La crème brûlée est un dessert incontournable de la cuisine française...",
        allergens: ["Lait", "Œufs"],
    },
    {
        id: "7",
        name: "Mousse au chocolat",
        price: "4€",
        image: require("../../assets/images/chocolate-mousse.jpg"),
        description: "Cette mousse au chocolat est légère et aérienne, offrant une explosion de saveurs chocolatées...",
        allergens: ["Lait", "Œufs"],
    },
    {
        id: "8",
        name: "Profiteroles",
        price: "7€",
        image: require("../../assets/images/profiteroles.jpg"),
        description: "Les profiteroles sont de petits choux garnis de crème pâtissière maison...",
        allergens: ["Gluten", "Lait", "Œufs"],
    },
];

export default function ItemDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const item = dishes.find((dish) => dish.id === id);

    const [inCart, setInCart] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);

    const filteredDishes = dishes.filter((dish) => dish.id !== id);

    if (!item) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Plat introuvable</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backText}>← Retour</Text>
            </TouchableOpacity>
            <Image source={item.image} style={styles.image} />
            <View style={styles.details}>
                <View style={styles.titleContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    <PanierButton inCart={inCart} toggleInCart={() => setInCart(!inCart)} />
                    <FavoriButton isFavorited={isFavorited} toggleIsFavorited={() => setIsFavorited(!isFavorited)} />
                </View>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.allergenTitle}>Allergènes</Text>
                <Text style={styles.allergenList}>
                    {item.allergens.map((allergen, index) => (
                        <Text key={index}>- {allergen}{"\n"}</Text>
                    ))}
                </Text>
            </View>
            <Text style={styles.suggestedTitle}>Plats Suggérés</Text>
            <FlatList
                data={filteredDishes.slice(0, 3)}
                horizontal
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ItemCard item={item} />}
                contentContainerStyle={styles.suggestedContainer}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 20 },
    backButton: { marginBottom: 10 },
    backText: { fontSize: 18, color: "blue" },
    image: {
        width: "100%",
        height: 250,
        borderRadius: 10,
        objectFit: "cover",
    },
    details: { marginTop: 20 },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 10,
    },
    name: { fontSize: 22, fontWeight: "bold", flex: 1 },
    price: { fontSize: 18, color: "red", marginVertical: 5 },
    description: { fontSize: 16, color: "#555", marginBottom: 10 },
    allergenTitle: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
    allergenList: { fontSize: 16, color: "#666" },
    errorText: { fontSize: 20, color: "red", textAlign: "center", marginTop: 50 },
    suggestedTitle: { fontSize: 20, fontWeight: "bold", marginTop: 30, marginBottom: 10 },
    suggestedContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingRight: 15,
    },
    separator: { width: 10 },
    card: {
        width: 200,
        height: 350,
        overflow: "hidden",
        borderRadius: 10,
        backgroundColor: "#f5f5f5",
        marginRight: 15,
        padding: 10,
    },
    cardImage: {
        width: "100%",
        height: 150,
        borderRadius: 10,
    },
    cardText: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
});
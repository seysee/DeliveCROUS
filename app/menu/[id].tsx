import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import PanierButton from "@/src/components/PanierButton";
import FavoriButton from "@/src/components/FavoriteButton";
import ItemCard from "../../src/components/ItemCard";

export default function ItemDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

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

                // Récupérer les plats suggérés de la même catégorie
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

    if (loading) {
        return <ActivityIndicator size="large" color="blue" style={styles.loader} />;
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backText}>← Retour</Text>
            </TouchableOpacity>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.details}>
                <View style={styles.titleContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    <PanierButton />
                    <FavoriButton />
                </View>
                <Text style={styles.price}>{item.price}€</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.allergenTitle}>Allergènes</Text>
                <Text style={styles.allergenList}>
                    {item.allergens.length > 0 ? item.allergens.map((allergen, index) => (
                        <Text key={index}>- {allergen}{"\n"}</Text>
                    )) : "Aucun"}
                </Text>
            </View>

            <Text style={styles.suggestedTitle}>Plats Suggérés</Text>
            <FlatList
                data={relatedItems.slice(0, 3)}
                horizontal
                keyExtractor={(dish) => dish.id}
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
    image: { width: "100%", height: 250, borderRadius: 10 },
    details: { marginTop: 20 },
    titleContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
    name: { fontSize: 22, fontWeight: "bold", flex: 1 },
    price: { fontSize: 18, color: "red", marginVertical: 5 },
    description: { fontSize: 16, color: "#555", marginBottom: 10 },
    allergenTitle: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
    allergenList: { fontSize: 16, color: "#666" },
    errorText: { fontSize: 20, color: "red", textAlign: "center", marginTop: 50 },
    suggestedTitle: { fontSize: 20, fontWeight: "bold", marginTop: 30, marginBottom: 10 },
    suggestedContainer: { flexDirection: "row", paddingRight: 15 },
    separator: { width: 10 },
    loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});

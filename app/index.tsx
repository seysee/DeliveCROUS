import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import ItemCard from "../src/components/ItemCard";
import { AuthProvider } from "@/src/context/AuthContext";
import { useEffect, useState } from "react";

export default function Page() {
    const [dishes, setDishes] = useState([]);
    const { width } = useWindowDimensions();
    const numColumns = width < 600 ? 2 : width < 760 ? 3 : 4; // 4 colonnes pour les écrans larges


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
            <SafeAreaView style={styles.safeContainer}>
                <View style={styles.container}>
                    <Text style={styles.title}>Menu</Text>
                    <FlatList
                        data={dishes}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <ItemCard item={item} />}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        contentContainerStyle={{ paddingBottom: 20 }} // Permet le scroll fluide
                        showsVerticalScrollIndicator={false} // Optionnel : cache la barre de scroll
                    />
                </View>
            </SafeAreaView>
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
        paddingHorizontal: 10, // Ajoute du padding horizontal pour espacer les colonnes
        paddingBottom: 20,
    },
});

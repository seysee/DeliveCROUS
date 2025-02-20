import { View, Text, FlatList, StyleSheet, SafeAreaView, useWindowDimensions, Platform } from "react-native";
import ItemCard from "../src/components/ItemCard";
import { AuthProvider } from "@/src/context/AuthContext";
import { useEffect, useState } from "react";
import { PanierProvider } from "@/src/context/PanierContext";

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
                <SafeAreaView style={styles.safeContainer}>
                    <View style={styles.container}>
                        <Text style={styles.title}>Menu</Text>
                        {/* Ajout de la clé pour forcer un nouveau rendu lorsque numColumns change */}
                        <FlatList
                            key={`numColumns-${numColumns}`} // Clé dynamique pour forcer le re-rendu
                            data={dishes}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => <ItemCard item={item} />}
                            numColumns={numColumns} // Ajuste le nombre de colonnes dynamiquement
                            // Applique columnWrapperStyle uniquement si c'est un navigateur web
                            columnWrapperStyle={Platform.OS === 'web' ? styles.row : null}
                            contentContainerStyle={{ paddingBottom: 20 }} // Permet un scroll fluide
                            showsVerticalScrollIndicator={false} // Optionnel : cache la barre de scroll
                        />
                    </View>
                </SafeAreaView>
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
        justifyContent: "space-between", // Espace entre les éléments
    },
    listContainer: {
        paddingHorizontal: 10, // Ajoute du padding horizontal pour espacer les colonnes
        paddingBottom: 20,
    },
});

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

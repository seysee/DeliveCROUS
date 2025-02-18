import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import ItemCard from "../src/components/ItemCard";
import { AuthProvider } from "@/src/context/AuthContext";

const dishes = [
    {
        id: "1",
        name: "Pâtes Bolognaise",
        price: "10€",
        image: require("../assets/images/spaghetti.jpg"),
        description: "Pâtes fraîches avec une sauce bolognaise maison, garnies de parmesan."
    },
    {
        id: "2",
        name: "Salade de fruits",
        price: "8€",
        image: require("../assets/images/fruits.jpg"),
        description: "Mélange rafraîchissant de fruits frais de saison, parfait pour l'été."
    },
    {
        id: "3",
        name: "Viande grillée",
        price: "12€",
        image: require("../assets/images/meat.jpg"),
        description: "Viande grillée tendre, accompagnée de légumes de saison."
    },
    {
        id: "4",
        name: "Maïs grillé",
        price: "7€",
        image: require("../assets/images/corn.jpg"),
        description: "Épi de maïs grillé, savamment assaisonné avec du beurre et des épices."
    },
    {
        id: "5",
        name: "Tarte aux pommes",
        price: "6€",
        image: require("../assets/images/apple-pie.jpg"),
        description: "Délicieuse tarte aux pommes avec une pâte dorée, parfaite pour le goûter."
    },
    {
        id: "6",
        name: "Crème brûlée",
        price: "5€",
        image: require("../assets/images/creme-brulee.jpg"),
        description: "Crème onctueuse et douce avec une croûte caramélisée qui fond en bouche."
    },
    {
        id: "7",
        name: "Mousse au chocolat",
        price: "4€",
        image: require("../assets/images/chocolate-mousse.jpg"),
        description: "Mousse légère et aérienne au chocolat noir, un vrai délice pour les amateurs de chocolat."
    },
    {
        id: "8",
        name: "Profiteroles",
        price: "7€",
        image: require("../assets/images/profiteroles.jpg"),
        description: "Pâte à choux garnie de crème pâtissière, nappée de chocolat fondant."
    },
];

export default function Page() {
    return (
        <AuthProvider>
            <SafeAreaView style={styles.safeContainer}>
                <View style={styles.container}>
                    <Text style={styles.title}>Menu</Text>
                    <FlatList
                        data={dishes}
                        keyExtractor={(item) => item.id}
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
    subtitle: {
        fontSize: 36,
        color: "#38434D",
    },
    row: {
        justifyContent: "space-between",
    },
});
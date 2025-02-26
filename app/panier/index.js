import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput, Button } from "react-native";
import { usePanier } from "../../src/context/PanierContext";
import { useRouter } from "expo-router";


export default function PanierScreen() {
    const { panier, mettreAJourQuantite, livraison, mettreAJourLivraison, passerCommande } = usePanier();
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const router = useRouter();


    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch("http://localhost:5000/items");
                if (!response.ok) throw new Error("Erreur de récupération des articles");

                const allItems = await response.json();
                const panierItems = panier
                    .map(p => {
                        const itemId = p.itemId.itemId;
                        const item = allItems.find(i => i.id === itemId);
                        return item ? { ...item, quantite: p.quantite } : null;
                    })
                    .filter(item => item !== null);

                setItems(panierItems);
            } catch (error) {
                console.error("Erreur:", error);
            }
        };

        fetchItems();
    }, [panier]);

    useEffect(() => {
        setItems(panier.filter(item => item.quantite > 0));
    }, [panier]);

    useEffect(() => {
        const calculerTotal = () => {
            const totalCalcule = items.reduce((acc, item) => acc + item.price * item.quantite, 0);
            setTotal(totalCalcule);
        };

        calculerTotal();
    }, [items]);

    const handleQuantiteChange = async (itemId, change) => {
        const item = panier.find(p => p.itemId.itemId === itemId);
        if (!item) return;

        const nouvelleQuantite = item.quantite + change;
        await mettreAJourQuantite(item.id, nouvelleQuantite);
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
                <Text style={styles.title}>Mon Panier</Text>

                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <Image source={{ uri: item.image }} style={styles.image} />
                            <View style={styles.details}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text>Prix: {item.price}€</Text>
                                <View style={styles.quantityContainer}>
                                    <TouchableOpacity onPress={() => handleQuantiteChange(item.id, -1)} style={styles.button}>
                                        <Text style={styles.buttonText}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.quantite}>Quantité: {item.quantite}</Text>
                                    <TouchableOpacity onPress={() => handleQuantiteChange(item.id, 1)} style={styles.button}>
                                        <Text style={styles.buttonText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                />

                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>Total: {total.toFixed(2)}€</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.title}>Adresse de Livraison</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Code Postal"
                        value={livraison.codePostal}
                        onChangeText={(text) => mettreAJourLivraison("codePostal", text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Bâtiment"
                        value={livraison.batiment}
                        onChangeText={(text) => mettreAJourLivraison("batiment", text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Salle TD"
                        value={livraison.salleTD}
                        onChangeText={(text) => mettreAJourLivraison("salleTD", text)}
                    />

                    <Button title="Passer commande" onPress={passerCommande} />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/CommandeEnCours")}>
                        <Text style={styles.buttonText}>📦 Commandes en cours</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/HistoriqueCommandes")}>
                        <Text style={styles.buttonText}>📜 Historique</Text>
                    </TouchableOpacity>

                </View>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff"
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center"
    },
    itemContainer: {
        flexDirection: "row",
        marginBottom: 20
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10
    },
    details: {
        justifyContent: "center"
    },
    name: {
        fontSize: 18,
        fontWeight: "bold"
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    button: {
        padding: 5,
        backgroundColor: "#ddd",
        margin: 5,
        borderRadius: 5
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    },
    quantite: {
        fontSize: 16
    },
    totalContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#eee",
        borderRadius: 5,
        alignItems: "center"
    },
    totalText: {
        fontSize: 18,
        fontWeight: "bold"
    },
    formContainer: {
        marginTop: 30,
        padding: 20,
        backgroundColor: "#f9f9f9",
        borderRadius: 10
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginVertical: 5
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20
    },
    secondaryButton: {
        padding: 10,
        backgroundColor: "#007bff",
        borderRadius: 5,
        alignItems: "center",
        width: "45%"
    },


});

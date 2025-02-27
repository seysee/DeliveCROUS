import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useAuth } from "../src/context/AuthContext";
import { usePanier } from "../src/context/PanierContext";

export default function CommandesEnCours() {
    const { user } = useAuth();
    const { confirmerReception } = usePanier();
    const [commandes, setCommandes] = useState([]);

    useEffect(() => {
        const fetchCommandes = async () => {
            try {
                const response = await fetch(`http://localhost:5000/commandes?userId=${user.id}&status=en attente`);
                if (!response.ok) throw new Error("Erreur de récupération des commandes");

                const data = await response.json();


                const commandesAvecDetails = await Promise.all(data.map(async (commande) => {
                    const itemsDetail = await Promise.all(commande.items.map(async (item) => {
                        const itemResponse = await fetch(`http://localhost:5000/items?id=${item.itemId.itemId}`);
                        const itemData = await itemResponse.json();
                        return { ...item, ...itemData[0] };
                    }));

                    return { ...commande, items: itemsDetail };
                }));

                setCommandes(commandesAvecDetails);
            } catch (error) {
                console.error("Erreur:", error);
            }
        };

        fetchCommandes();
    }, [user]);

    const handleCommandeRecue = (commandeId) => {
        confirmerReception(commandeId);
        setCommandes(prev => prev.filter(commande => commande.id !== commandeId));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📦 Commandes en cours</Text>
            {commandes.length === 0 ? (
                <Text style={styles.emptyText}>Aucune commande en cours</Text>
            ) : (
                <FlatList
                    data={commandes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.commandeItem}>
                            <Text>Commande #{item.id}</Text>
                            <Text>Statut: {item.status}</Text>
                            <FlatList
                                data={item.items}
                                keyExtractor={(subItem) => subItem.id.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.itemContainer}>
                                        <Image source={{ uri: item.image }} style={styles.image} />
                                        <View style={styles.details}>
                                            <Text style={styles.name}>{item.name}</Text>
                                            <Text>Prix: {item.price}€</Text>
                                            <Text>Quantité: {item.quantite}</Text>
                                        </View>
                                    </View>
                                )}
                            />

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleCommandeRecue(item.id)}
                            >
                                <Text style={styles.buttonText}>Commande reçue</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
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
    emptyText: {
        textAlign: "center",
        fontSize: 16,
        color: "gray"
    },
    commandeItem: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: "#f1f1f1",
        borderRadius: 10
    },
    itemContainer: {
        flexDirection: "row",
        marginBottom: 15
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
    button: {
        padding: 10,
        backgroundColor: "#4CAF50",
        borderRadius: 5,
        marginTop: 10
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    }
});

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useAuth } from "../src/context/AuthContext";
import { usePanier } from "../src/context/PanierContext";
import Button from "../src/components/Button";
import { useRouter } from "expo-router";

export default function CommandesEnCours() {
    const { user } = useAuth();
    const { confirmerReception } = usePanier();
    const [commandes, setCommandes] = useState([]);
    const router = useRouter();

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
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backText}>← Retour</Text>
            </TouchableOpacity>

            <Text style={styles.title}>📦 Commandes en cours</Text>
            {commandes.length === 0 ? (
                <Text style={styles.emptyText}>Aucune commande en cours</Text>
            ) : (
                <FlatList
                    data={commandes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.commandeItem}>
                            <Text style={styles.commandeTitle}>Commande #{item.id}</Text>
                            <Text style={[styles.statusText, { color: item.status === 'en attente' ? '#ff9800' : '#4caf50' }]}>
                                Statut : {item.status}
                            </Text>
                            <FlatList
                                data={item.items}
                                keyExtractor={(subItem) => subItem.id.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.itemContainer}>
                                        <Image source={{ uri: item.image }} style={styles.image} />
                                        <View style={styles.details}>
                                            <Text style={styles.name}>{item.name}</Text>
                                            <Text style={styles.price}>Prix : <Text style={styles.priceAmount}>{item.price}€</Text></Text>
                                            <Text style={styles.quantity}>Quantité : {item.quantite}</Text>
                                        </View>
                                    </View>
                                )}
                            />
                            <Button title="Commande reçue" onPress={() => handleCommandeRecue(item.id)} />
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
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 28,
        fontFamily: "Poppins-Bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#333333"
    },
    emptyText: {
        textAlign: "center",
        fontSize: 16,
        color: "#999999",
        fontFamily: "Poppins-Regular",
    },
    commandeItem: {
        padding: 15,
        marginLeft: 15,
    },
    commandeTitle: {
        fontSize: 18,
        fontFamily: "Poppins-Medium",
        marginBottom: 10,
        color: "#333333",
    },
    statusText: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        marginBottom: 15,
        color: "#4caf50",
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
        fontFamily: "Poppins-Medium",
        color: "#333333",
    },
    price: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
    },
    priceAmount: {
        fontFamily: "Poppins-Medium",
    },
    quantity: {
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        color: "#757575",
    },
    backButton: {
        marginBottom: 15,
        marginLeft: 15,
    },
    backText: {
        fontSize: 18,
        color: "#e01020",
        fontFamily: "Poppins-Bold",
    },
});

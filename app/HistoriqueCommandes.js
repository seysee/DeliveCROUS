import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../src/context/AuthContext";
import { useRouter } from "expo-router";

export default function HistoriqueCommandesScreen() {
    const { user } = useAuth();
    const [historique, setHistorique] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchHistorique = async () => {
            try {
                const response = await fetch(`http://localhost:5000/commandes?userId=${user.id}&status=reçue`);
                if (!response.ok) throw new Error("Erreur de récupération de l'historique");

                const data = await response.json();
                setHistorique(data);
            } catch (error) {
                console.error("Erreur:", error);
            }
        };

        fetchHistorique();
    }, [user]);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backText}>← Retour</Text>
            </TouchableOpacity>

            <Text style={styles.title}>📜 Historique des commandes</Text>
            {historique.length === 0 ? (
                <Text style={styles.emptyText}>Aucune commande passée</Text>
            ) : (
                <FlatList
                    data={historique}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.commandeItem}>
                            <Text style={styles.commandeTitle}>Commande #{item.id}</Text>
                            <Text style={styles.commandeDate}>Date: {new Date(item.date).toLocaleDateString()}</Text>
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
        marginLeft: 15,
    },
    title: {
        fontSize: 24,
        fontFamily: "Poppins-Bold",
        marginBottom: 20,
        textAlign: "center"
    },
    emptyText: {
        textAlign: "center",
        fontSize: 16,
        color: "gray",
        fontFamily: "Poppins-Regular"
    },
    backButton: {
        marginBottom: 15,
    },
    backText: {
        fontSize: 18,
        color: "#e01020",
        fontFamily: "Poppins-Bold",
    },
    commandeItem: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: "#f1f1f1",
        borderRadius: 10
    },
    commandeTitle: {
        fontSize: 18,
        fontFamily: "Poppins-Medium",
        color: "#333333",
    },
    commandeDate: {
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        color: "#757575"
    }
});

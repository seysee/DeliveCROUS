import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useAuth } from "../src/context/AuthContext";

export default function HistoriqueCommandesScreen() {
    const { user } = useAuth();
    const [historique, setHistorique] = useState([]);

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
            <Text style={styles.title}>📜 Historique des commandes</Text>
            {historique.length === 0 ? (
                <Text style={styles.emptyText}>Aucune commande passée</Text>
            ) : (
                <FlatList
                    data={historique}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.commandeItem}>
                            <Text>Commande #{item.id}</Text>
                            <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
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
    }
});

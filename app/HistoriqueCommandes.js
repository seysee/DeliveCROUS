/**
 * Historique des Commandes
 *
 * Ce composant affiche l'historique des commandes d'un utilisateur spécifique. Les commandes sont récupérées à partir d'une API locale en fonction de l'ID de l'utilisateur et du statut de la commande (ici, "reçue"). Si l'utilisateur n'a aucune commande reçue, un message "Aucune commande passée" s'affiche. Sinon, une liste des commandes passées est affichée, incluant l'ID et la date de chaque commande.
 *
 * **Composants principaux :**
 *
 * 1. **HistoriqueCommandesScreen** :
 *    - Ce composant utilise le contexte d'authentification pour obtenir l'ID de l'utilisateur actuellement connecté via `useAuth`.
 *    - Il récupère l'historique des commandes via une requête API et l'affiche dans une liste.
 *    - Utilise `useEffect` pour effectuer la récupération des données lorsque le composant est monté ou lorsque l'utilisateur change.
 *    - La page affiche soit une liste des commandes reçues, soit un message indiquant qu'il n'y a pas de commandes.
 *
 * **Détails d'implémentation :**
 * - L'utilisation de `useState` permet de gérer l'état des commandes (`historique`) récupérées depuis l'API.
 * - L'appel à l'API utilise `fetch` pour récupérer les commandes en filtrant par `userId` et `status=reçue`.
 * - Si l'historique des commandes est vide, un message est affiché. Sinon, un `FlatList` est utilisé pour rendre les commandes dans une liste déroulante.
 * - Le formatage de la date des commandes est effectué à l'aide de `toLocaleDateString()` pour l'affichage.
 *
 * **Composants utilisés :**
 * - `FlatList` : Permet d'afficher une liste de commandes de manière optimisée, avec une clé unique pour chaque item (ici, l'ID de la commande).
 * - `useAuth` : Un hook personnalisé pour accéder aux données de l'utilisateur actuellement connecté.
 *
*/

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

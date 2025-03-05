/**
 * Composant CommandesEnCours -
 *
 * Ce composant est responsable de l'affichage des commandes en cours d'un utilisateur. Il récupère les commandes dont le statut est "en attente" depuis une API et permet de marquer une commande comme reçue.
 *
 * **Fonctionnalités :**
 *
 * 1. **Récupération des commandes en attente :**
 *    - Utilise `useEffect` pour récupérer les commandes de l'utilisateur à partir d'une API (avec un filtre pour les commandes ayant le statut "en attente").
 *    - Pour chaque commande, les détails des items sont récupérés à partir d'une autre API et associés à la commande.
 *    - Les commandes sont stockées dans l'état local `commandes` via `useState`.
 *
 * 2. **Affichage des commandes :**
 *    - Si l'utilisateur n'a aucune commande en cours, un message "Aucune commande en cours" est affiché.
 *    - Si des commandes sont présentes, elles sont affichées sous forme de liste (`FlatList`), avec les informations relatives à chaque commande, y compris les détails des items (image, prix, quantité).
 *
 * 3. **Marquer une commande comme reçue :**
 *    - Lorsqu'un utilisateur clique sur le bouton "Commande reçue", la commande est marquée comme reçue via la fonction `confirmerReception` fournie par le contexte `PanierContext`.
 *    - La commande est ensuite retirée de la liste des commandes en attente dans l'état local.
 *
 * **Fonctions principales :**
 * - `fetchCommandes` : Fonction asynchrone utilisée pour récupérer les commandes en cours de l'utilisateur à partir de l'API.
 * - `handleCommandeRecue` : Fonction qui est appelée lorsqu'un utilisateur marque une commande comme reçue. Elle appelle la fonction `confirmerReception` et met à jour la liste des commandes.
 *
 * **Hooks utilisés :**
 * - `useState` : Utilisé pour gérer l'état local des commandes.
 * - `useEffect` : Utilisé pour effectuer la récupération des commandes dès que le composant est monté, et pour le mettre à jour lorsque l'utilisateur change.
 *
 * **Détails de l'affichage des items :**
 * - Chaque commande contient plusieurs items, qui sont affichés avec leurs informations : image, nom, prix et quantité.
 * - Le bouton "Commande reçue" permet de marquer la commande comme reçue et de la supprimer de la liste des commandes en cours.
*/

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

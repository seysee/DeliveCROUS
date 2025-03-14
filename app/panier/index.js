/**
 * PanierScreen Component
 *
 * Le composant `PanierScreen` est l'écran principal du panier dans l'application.
 * Il permet à l'utilisateur de visualiser les articles ajoutés à son panier, de
 * modifier les quantités d'articles, de calculer le total de la commande et de
 * saisir une adresse de livraison avant de finaliser la commande.
 *
 * Fonctionnalités principales :
 * 1. Affichage des articles dans le panier : Liste des articles avec leur nom, prix, quantité et image.
 * 2. Modification des quantités d'articles : Les utilisateurs peuvent ajuster la quantité d'un article.
 * 3. Calcul dynamique du total : Le total du panier est mis à jour automatiquement en fonction des modifications des quantités.
 * 4. Saisie de l'adresse de livraison : Les utilisateurs peuvent entrer des informations d'adresse, telles que le code postal, le bâtiment et la salle TD.
 * 5. Navigation : L'utilisateur peut naviguer vers l'écran des commandes en cours ou l'historique des commandes via des boutons.
 *
 * Hooks utilisés :
 * - useState : Gère les états locaux du panier, des articles et du total.
 * - useEffect : Effectue des actions lorsque les états changent, comme récupérer les articles du serveur et recalculer le total.
 * - usePanier: Hook personnalisé qui permet d'accéder aux données du panier et de les mettre à jour (quantité des articles, adresse de livraison).
 * - useRouter : Permet de gérer la navigation entre les différentes pages de l'application.
 *
 * Flux de données et logique de fonctionnement :
 * - Lorsque le panier est mis à jour (ajout ou suppression d'articles), les articles sont récupérés depuis le serveur.
 * - Le total de la commande est calculé en fonction des quantités et des prix des articles présents dans le panier.
 * - Les informations de livraison peuvent être modifiées via des champs de saisie (code postal, bâtiment, salle TD).
 * - L'utilisateur peut passer une commande en appuyant sur le bouton "Passer commande" qui appelle la fonction `passerCommande`.
 *
 * Dépendances :
 * - Ce composant dépend de l'API d'un serveur local (`http://localhost:5000/items`) pour récupérer la liste des articles.
 */

import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, FlatList, Image, StyleSheet, ActivityIndicator, useWindowDimensions } from "react-native";
import { usePanier } from "../../src/context/PanierContext";
import { useRouter } from "expo-router";
import Button from "../../src/components/Button";
import Input from "../../src/components/Input";
import { useAuth } from "../../src/context/AuthContext";

export default function PanierScreen() {
    const { panier, mettreAJourQuantite, livraison, mettreAJourLivraison, passerCommande } = usePanier();
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const router = useRouter();
    const { width } = useWindowDimensions();
    const { user } = useAuth();

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

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Mon Panier</Text>
                <Text style={styles.authMessage}>
                    Connecte-toi pour ajouter et voir ton panier. 🔐
                </Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Mon Panier</Text>

            <Text style={styles.reloadMessage}>N'oublie pas de recharger la page après chaque ajout/suppression d'article ! 🔄</Text> {/* Message de rechargement */}

            <View style={styles.buttonsRow}>
                <Button title="📦 Commandes en cours" onPress={() => router.push("/CommandeEnCours")} style={styles.buttonRow} />
                <Button title="📜 Historique" onPress={() => router.push("/HistoriqueCommandes")} style={styles.buttonRow} />
            </View>

            {items.length === 0 ? (
                <Text style={styles.emptyMessage}>C'est vide par ici... 🏜️</Text>
            ) : (
                <View style={[styles.rowContainer, width > 768 && styles.rowContainerDesktop]}>
                    <View style={[styles.itemsContainer, width > 768 && styles.itemsContainerDesktop]}>
                        <Text style={styles.sectionTitle}>Articles dans ton Panier</Text>
                        <FlatList
                            data={items}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.itemContainer}>
                                    <Image source={{ uri: item.image }} style={styles.image} />
                                    <View style={styles.details}>
                                        <Text style={styles.name}>{item.name}</Text>
                                        <Text>{item.price}€</Text>
                                        <View style={styles.quantityContainer}>
                                            <Button title="-" onPress={() => handleQuantiteChange(item.id, -1)} style={styles.smallButton} />
                                            <Text style={styles.quantite}>{item.quantite}</Text>
                                            <Button title="+" onPress={() => handleQuantiteChange(item.id, 1)} style={styles.smallButton} />
                                        </View>
                                    </View>
                                </View>
                            )}
                        />
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalText}>Total: {total.toFixed(2)}€</Text>
                        </View>
                    </View>

                    <View style={[styles.formContainer, width > 768 && styles.formContainerDesktop]}>
                        <Text style={styles.sectionTitle2}>Où veux-tu te faire livrer ?</Text>
                        <Input placeholder="Code Postal" value={livraison.codePostal} onChangeText={(text) => mettreAJourLivraison("codePostal", text)} />
                        <Input placeholder="Bâtiment" value={livraison.batiment} onChangeText={(text) => mettreAJourLivraison("batiment", text)} />
                        <Input placeholder="Salle TD" value={livraison.salleTD} onChangeText={(text) => mettreAJourLivraison("salleTD", text)} />
                        <Button title="Passer commande" onPress={passerCommande} style={styles.buttonDesktop} />
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    title: {
        fontSize: 28,
        fontFamily: "Poppins-Bold",
        marginBottom: 20,
        textAlign: "center",
    },
    reloadMessage: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        color: "#e01020",
        textAlign: "center",
        marginBottom: 10,
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    buttonRow: {
        marginHorizontal: 10,
    },
    sectionTitle: {
        fontSize: 15,
        fontFamily: "Poppins-Regular",
        marginBottom: 10,
        marginTop: 20,
        marginLeft: 15,
        color: '#757575',
    },
    sectionTitle2: {
        fontSize: 15,
        fontFamily: "Poppins-Regular",
        marginBottom: 10,
        marginTop: 20,
        color: '#757575',
    },
    itemContainer: {
        flexDirection: "row",
        backgroundColor: "#f9f9f9",
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
        marginLeft: 15,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10
    },
    details: {
        justifyContent: "center",
        flex:1,
        gap: 10,
    },
    name: {
        fontSize: 18,
        fontFamily: "Poppins-Medium",
    },
    price: {
        fontSize: 16,
        color: "#e01020",
        fontFamily: "Poppins-Regular",
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    quantite: {
        fontSize: 16,
        padding: 3,
    },
    totalContainer: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    totalText: {
        fontSize: 18,
        fontFamily: "Poppins-Medium",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonDesktop: {
        maxWidth: 300,
        alignSelf: "center",
    },
    rowContainer: {
        flexDirection: 'column',
    },
    rowContainerDesktop: {
        flexDirection: 'row',
    },
    itemsContainer: {
        flex: 1,
    },
    itemsContainerDesktop: {
        flex: 1,
        paddingRight: 20,
    },
    formContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
    },
    formContainerDesktop: {
        flex: 1,
        maxWidth: "50%",
        alignSelf: "center",
    },
    smallButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        minWidth: 30,
        borderRadius: 50,
    },
    emptyMessage: {
        fontSize: 18,
        color: "gray",
        textAlign: "center",
        marginTop: 20,
        fontFamily: "Poppins-Regular"
    },
    authMessage: {
        fontSize: 18,
        color: "gray",
        textAlign: "center",
        marginTop: 20,
        fontFamily: "Poppins-Regular"
    },
});

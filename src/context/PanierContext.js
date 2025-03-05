/**
 * PanierContext - Gestion du panier et des commandes utilisateur
 *
 * Ce fichier gère un contexte de panier d'achat (`PanierContext`) pour un utilisateur connecté. Il permet à l'utilisateur de :
 * 1. Ajouter des articles au panier.
 * 2. Mettre à jour la quantité d'articles dans le panier.
 * 3. Supprimer des articles du panier.
 * 4. Passer une commande avec les articles du panier.
 * 5. Gérer les informations de livraison.
 * 6. Suivre les commandes en attente et les historiques de commandes.
 *
 * **Composants clés :**
 * - `PanierContext` : Contexte React qui fournit l'état du panier (`panier`), les commandes (`commandes`), l'historique des commandes (`historique`),
 *   et des fonctions permettant d'ajouter, de supprimer ou de mettre à jour des articles dans le panier, de passer une commande, et de gérer les informations de livraison.
 * - `usePanier` : Hook personnalisé permettant de consommer le `PanierContext` dans n'importe quel composant enfant.
 * - `PanierProvider` : Composant fournisseur du contexte du panier qui enveloppe l'application et rend l'état du panier accessible.
 *
 * **Fonctionnalités principales :**
 * 1. **Chargement du panier et des commandes** : Lorsqu'un utilisateur est connecté, les données du panier et des commandes sont récupérées depuis une API externe
 *    (via `fetch` sur `localhost:5000/panier` et `localhost:5000/commandes`).
 * 2. **Ajout d'articles au panier** : L'utilisateur peut ajouter un article au panier, en vérifiant si l'article existe déjà dans le panier.
 * 3. **Modification de la quantité** : L'utilisateur peut mettre à jour la quantité d'un article dans le panier ou le supprimer si la quantité devient 0.
 * 4. **Passage de commande** : Lorsque l'utilisateur passe commande, le contenu du panier est transformé en une commande et envoyée à l'API. Les articles sont ensuite supprimés du panier.
 * 5. **Suivi des commandes** : Les commandes en attente sont séparées des commandes historiques, et l'utilisateur peut marquer une commande comme reçue.
 * 6. **Mise à jour des informations de livraison** : L'utilisateur peut entrer ou mettre à jour les informations de livraison, comme le code postal, le bâtiment, et la salle TD.
 *
 * **Données manipulées :**
 * - `panier` : Un tableau contenant les articles ajoutés au panier, chacun avec un `itemId`, `quantite`, et `price`.
 * - `commandes` : Un tableau contenant les commandes en cours de l'utilisateur (avec un statut "en attente").
 * - `historique` : Un tableau contenant les commandes historiques (avec un statut "reçue").
 * - `livraison` : Un objet contenant les informations de livraison (codePostal, batiment, salleTD).
 *
 *
 * **Dépendances :**
 * - `useAuth` : Hook provenant du contexte d'authentification pour obtenir les informations sur l'utilisateur connecté.
 * - `fetch` : Fonction utilisée pour envoyer des requêtes HTTP au serveur pour récupérer ou mettre à jour les données du panier et des commandes.
 * - `router` : Utilisé pour naviguer vers la page de commande en cours (`/CommandeEnCours`) après un passage de commande réussi.
 *
 */
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {router} from "expo-router";

const PanierContext = createContext();

export function usePanier() {
    return useContext(PanierContext);
}

export function PanierProvider({ children }) {
    const [panier, setPanier] = useState([]);
    const [commandes, setCommandes] = useState([]);
    const [historique, setHistorique] = useState([]);
    const { user } = useAuth();
    const [livraison, setLivraison] = useState({
        codePostal: "",
        batiment: "",
        salleTD: ""
    });

    useEffect(() => {
        if (user) {
            fetchPanier();
            fetchCommandes();
        }
    }, [user]);

    const fetchPanier = async () => {
        try {
            const response = await fetch(`http://localhost:5000/panier?userId=${user.id}`);
            if (!response.ok) throw new Error("Erreur lors de la récupération du panier");
            const data = await response.json();
            setPanier(data);
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    const fetchCommandes = async () => {
        try {
            const response = await fetch(`http://localhost:5000/commandes?userId=${user.id}`);
            if (!response.ok) throw new Error("Erreur lors de la récupération des commandes");
            const data = await response.json();

            setCommandes(data.filter(c => c.status === "en attente"));
            setHistorique(data.filter(c => c.status === "reçue").slice(-5));
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    const ajouterAuPanier = async (itemId) => {
        const existingItem = panier.find(item => item.itemId === itemId);
        if (existingItem) {
            await mettreAJourQuantite(existingItem.id, existingItem.quantite + 1);
            return;
        }

        const newItem = { userId: user.id, itemId, quantite: 1 };
        try {
            const response = await fetch("http://localhost:5000/panier", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem)
            });
            if (!response.ok) throw new Error("Erreur lors de l'ajout au panier");
            fetchPanier();
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    const mettreAJourQuantite = async (itemId, quantite) => {
        if (quantite <= 0) {
            await supprimerDuPanier(itemId);
            return;
        }
        try {
            await fetch(`http://localhost:5000/panier/${itemId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantite })
            });
            fetchPanier();
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    const supprimerDuPanier = async (itemId) => {
        try {
            await fetch(`http://localhost:5000/panier/${itemId}`, { method: "DELETE" });
            setPanier(prev => prev.filter(item => item.id !== itemId));
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    const mettreAJourLivraison = (champ, valeur) => {
        setLivraison(prev => ({ ...prev, [champ]: valeur }));
    };

    const passerCommande = async () => {
        if (panier.length === 0) return;

        const nouvelleCommande = {
            userId: user.id,
            items: panier.map(item => ({
                itemId: item.itemId,
                quantite: item.quantite
            })),
            total: panier.reduce((acc, item) => acc + item.price * item.quantite, 0),
            date: new Date().toISOString(),
            status: "en attente",
            livraison
        };

        try {
            const response = await fetch("http://localhost:5000/commandes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nouvelleCommande)
            });

            if (!response.ok) throw new Error("Erreur lors de la commande");


            await Promise.all(panier.map(item => supprimerDuPanier(item.id)));

            await fetchCommandes();
            router.push("/CommandeEnCours");
        } catch (error) {
            console.error("Erreur:", error);
        }
    };



    const confirmerReception = async (commandeId) => {
        try {
            const response = await fetch(`http://localhost:5000/commandes/${commandeId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "reçue" })
            });

            if (!response.ok) throw new Error("Erreur de mise à jour du statut");

            fetchCommandes();
        } catch (error) {
            console.error("Erreur:", error);
        }
    };



    return (
        <PanierContext.Provider value={{
            panier, ajouterAuPanier, mettreAJourQuantite, supprimerDuPanier,
            livraison, passerCommande, confirmerReception, mettreAJourLivraison,
            commandes, historique
        }}>
            {children}
        </PanierContext.Provider>
    );
}
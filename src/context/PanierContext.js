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

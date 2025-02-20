import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const PanierContext = createContext();

export function usePanier() {
    return useContext(PanierContext);
}

export function PanierProvider({ children }) {
    const [panier, setPanier] = useState([]);
    const { user } = useAuth();

    // Fonction pour récupérer les données du panier
    const fetchPanier = async () => {
        if (!user) {
            setPanier([]); // Réinitialiser le panier si aucun utilisateur connecté
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/panier?userId=${user.id}`);
            if (!response.ok) throw new Error("Erreur lors de la récupération du panier");

            const data = await response.json();
            setPanier(data);
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    useEffect(() => {
        fetchPanier();
    }, [user]); // Recharge le panier lorsque l'utilisateur change

    // Fonction d'ajout au panier
    const ajouterAuPanier = async (itemId) => {
        if (!user) return;

        const existingItem = panier.find(item => item.itemId === itemId);
        if (existingItem) {
            await mettreAJourQuantite(existingItem.id, existingItem.quantite + 1);
            return;
        }

        const newItem = {
            userId: user.id,
            itemId: itemId,
            quantite: 1
        };

        try {
            const response = await fetch("http://localhost:5000/panier", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem)
            });

            if (!response.ok) throw new Error("Erreur lors de l'ajout au panier");

            await fetchPanier(); // ✅ Mettre à jour immédiatement après l'ajout
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    // Fonction pour mettre à jour la quantité d'un item
    const mettreAJourQuantite = async (itemId, quantite) => {
        if (quantite <= 0) {
            await supprimerDuPanier(itemId);
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/panier/${itemId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantite }),
            });

            if (!response.ok) throw new Error("Erreur de mise à jour");

            fetchPanier(); // ✅ Rafraîchir le panier après la mise à jour
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    const supprimerDuPanier = async (itemId) => {
        try {
            const response = await fetch(`http://localhost:5000/panier/${itemId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Erreur lors de la suppression du produit");

            fetchPanier(); // ✅ Rafraîchir le panier après suppression
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    return (
        <PanierContext.Provider value={{ panier, ajouterAuPanier, mettreAJourQuantite, supprimerDuPanier }}>
            {children}
        </PanierContext.Provider>
    );
}

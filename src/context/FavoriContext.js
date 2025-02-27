import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const FavoriContext = createContext();

export function useFavoris() {
    return useContext(FavoriContext);
}

export const FavoriProvider = ({ children }) => {
    const { user } = useAuth();
    const [favoris, setFavoris] = useState([]);
    const [loading, setLoading] = useState(true);  // Ajout du state de chargement

    useEffect(() => {
        const loadFavoris = async () => {
            if (user) {
                try {
                    const response = await fetch(`http://localhost:5000/users/${user.id}`);
                    if (!response.ok) throw new Error("Erreur de récupération des favoris");

                    const userData = await response.json();
                    setFavoris(userData.favoris || []);
                } catch (error) {
                    console.error("Erreur lors du chargement des favoris:", error);
                } finally {
                    setLoading(false);  // On termine le chargement après la récupération
                }
            } else {
                setLoading(false);  // Si pas d'utilisateur, on termine le chargement
            }
        };

        loadFavoris();
    }, [user]);

    const toggleFavori = async (itemId) => {
        if (!user) return;

        const newFavoris = favoris.includes(itemId)
            ? favoris.filter(id => id !== itemId)  // Suppression si déjà en favori
            : [...favoris, itemId];  // Ajout si pas encore en favori

        setFavoris(newFavoris);

        try {
            await fetch(`http://localhost:5000/users/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ favoris: newFavoris }),
            });
        } catch (error) {
            console.error("Erreur lors de la mise à jour des favoris:", error);
        }
    };

    return (
        <FavoriContext.Provider value={{ favoris, toggleFavori, loading }}>
            {children}
        </FavoriContext.Provider>
    );
};

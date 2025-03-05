/**
 * FavoriContext - Gestion des favoris utilisateur
 *
 * Ce fichier gère un contexte de favoris (`FavoriContext`) qui permet à un utilisateur connecté de gérer ses éléments favoris.
 * Il inclut des fonctionnalités pour récupérer les favoris d'un utilisateur depuis une base de données et les modifier en ajoutant
 * ou supprimant des éléments de la liste des favoris de l'utilisateur.
 *
 * **Fonctionnalités principales :**
 * 1. **Chargement des favoris** : Lorsqu'un utilisateur est connecté, ses favoris sont récupérés depuis une API externe
 *    (via `fetch` sur `localhost:5000/users/{user.id}`) et stockés dans le contexte.
 * 2. **Modification des favoris** : L'utilisateur peut ajouter ou supprimer des éléments de sa liste de favoris.
 *    Les changements sont reflétés immédiatement dans le contexte et envoyés à l'API pour mise à jour.
 * 3. **Chargement conditionnel** : Si l'utilisateur est déconnecté, le chargement des favoris ne se produit pas.
 *
 * **Composants clés :**
 * - `FavoriContext` : Contexte React qui fournit l'état des favoris (`favoris`), la fonction pour modifier les favoris (`toggleFavori`),
 *   ainsi qu'un état de chargement (`loading`) à travers l'application.
 * - `useFavoris` : Hook personnalisé permettant d'accéder facilement aux favoris dans n'importe quel composant enfant de `FavoriProvider`.
 * - `FavoriProvider` : Composant fournisseur du contexte des favoris qui enveloppe l'application et rend l'état des favoris accessible.
 *
 * **Structure de données :**
 * - `favoris` : Un tableau contenant les identifiants des éléments favoris de l'utilisateur.
 * - `loading` : Un booléen qui indique si les favoris sont en train de se charger depuis l'API.
 *
 * **Flux de données :**
 * - Lors du changement d'utilisateur ou du chargement initial, les favoris sont récupérés depuis le serveur via une requête API.
 * - Lors de la modification des favoris (`toggleFavori`), l'état de `favoris` est mis à jour et la modification est envoyée à l'API pour stockage.
 *
 *
 * **Dépendances :**
 * - `useAuth` : Hook provenant du contexte d'authentification pour obtenir les informations sur l'utilisateur connecté.
 * - `fetch` : Fonction utilisée pour envoyer des requêtes HTTP au serveur pour récupérer ou mettre à jour les favoris.
 *
 */
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const FavoriContext = createContext();

export function useFavoris() {
    return useContext(FavoriContext);
}

export const FavoriProvider = ({ children }) => {
    const { user } = useAuth();
    const [favoris, setFavoris] = useState([]);
    const [loading, setLoading] = useState(true);

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
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        loadFavoris();
    }, [user]);

    const toggleFavori = async (itemId) => {
        if (!user) return;

        const newFavoris = favoris.includes(itemId)
            ? favoris.filter(id => id !== itemId)
            : [...favoris, itemId];

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
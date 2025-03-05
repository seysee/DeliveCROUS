/**
 * AuthContext - Gestion de l'authentification utilisateur
 *
 * Ce fichier contient un contexte d'authentification (`AuthContext`) permettant de gérer l'authentification
 * de l'utilisateur à travers des fonctionnalités de connexion et de déconnexion, tout en stockant de manière persistante
 * les informations de l'utilisateur dans `AsyncStorage`.
 *
 * **Fonctionnalités principales :**
 * 1. **Connexion (signIn)** : Permet à l'utilisateur de se connecter en fournissant un email et un mot de passe.
 * 2. **Déconnexion (signOut)** : Permet à l'utilisateur de se déconnecter, supprimant ainsi les informations de l'utilisateur du contexte et du stockage.
 * 3. **Persistante de l'utilisateur connecté** : Lors du lancement de l'application, si des informations d'utilisateur sont présentes dans `AsyncStorage`, elles sont chargées et l'utilisateur est automatiquement connecté.
 *
 * **Composants clés :**
 * - `AuthContext` : Contexte React qui fournit l'état de l'utilisateur ainsi que les fonctions `signIn` et `signOut` à travers l'application.
 * - `useAuth` : Hook personnalisé permettant d'accéder facilement à l'authentification dans n'importe quel composant enfant de `AuthProvider`.
 * - `AuthProvider` : Composant fournisseur du contexte d'authentification qui enveloppe l'application et rend l'état de l'utilisateur accessible via le contexte.
 *
 * **Structure de données :**
 * - L'objet `user` contient les informations personnelles de l'utilisateur (id, email, nom, prénom, photo).
 *
 * **Flux de données :**
 * - Lors de la connexion (`signIn`), les informations de l'utilisateur sont récupérées à partir de l'API via le service `login`. Ces informations sont ensuite stockées dans le contexte et dans `AsyncStorage` pour la persistance.
 * - Lors de la déconnexion (`signOut`), l'état de l'utilisateur est réinitialisé et les informations de l'utilisateur sont supprimées de `AsyncStorage`.
 *
 * **Exemple d'utilisation :**
 * ```javascript
 * const { user, signIn, signOut } = useAuth();
 *
 * signIn("email@example.com", "password123");
 *
 * // Pour se déconnecter
 * signOut();
 * ```
 *
 * **Dépendances :**
 * - `AsyncStorage` : Utilisé pour stocker et récupérer de manière persistante les informations de l'utilisateur sur le périphérique.
 * - `login` (service API) : Fonction d'API permettant de récupérer les données de l'utilisateur en fonction des informations de connexion fournies.
 *
 * **Interfaces :**
 * - `User` : Représente les informations d'un utilisateur authentifié.
 * - `AuthContextType` : Type du contexte d'authentification, définissant les propriétés `user`, `signIn` et `signOut`.
 *
 * **Hooks :**
 * - `useAuth` : Hook personnalisé permettant de consommer le `AuthContext` dans n'importe quel composant enfant.
 *
 */
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { login } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
    id: string;
    email: string;
    nom: string;
    prenom: string;
    photo?: string | null;
}

interface AuthContextType {
    user: User | null;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}


export const AuthContext = createContext<AuthContextType | null>(null);


export function useAuth() {
    return useContext(AuthContext);
}


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        };
        loadUser();
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            console.log("🔹 Tentative de connexion avec :", email, password);
            const userData = await login(email, password);

            if (!userData) {
                throw new Error("Utilisateur non trouvé");
            }

            console.log(" Utilisateur trouvé :", userData);
            setUser(userData);
            await AsyncStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
            console.error(" Erreur d'authentification :", error);
            throw error;
        }
    };

    const signOut = async () => {
        setUser(null);
        await AsyncStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};


export { AuthContext, useAuth };
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

// Création du contexte
export const AuthContext = createContext<AuthContextType | null>(null);

// Création du hook useAuth
export function useAuth() {
    return useContext(AuthContext);
}

// Fournisseur d'authentification
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

// Exporte le contexte et le hook personnalisé
export { AuthContext, useAuth };

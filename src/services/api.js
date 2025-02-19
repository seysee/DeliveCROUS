const API_URL = "http://localhost:5000";

export const login = async (email: string, password: string) => {
    console.log("📡 Envoi de la requête au serveur...");

    try {
        const response = await fetch(`${API_URL}/users`);
        console.log(" Réponse reçue :", response.status);

        if (!response.ok) {
            throw new Error(" Erreur serveur !");
        }

        const users = await response.json();
        console.log(" Utilisateurs récupérés :", users);

        const user = users.find((u) => u.email === email && u.password === password);
        if (!user) {
            console.log(" Email ou mot de passe incorrect !");
            throw new Error("Email ou mot de passe incorrect");
        }

        console.log(" Utilisateur trouvé :", user);
        return user;
    } catch (error) {
        console.error(" Erreur API :", error);
        throw error;
    }
};

export const updateUser = async (id, updatedData) => {
    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la mise à jour des informations.");
        }

        const updatedUser = await response.json();
        return updatedUser;
    } catch (error) {
        console.error(" Erreur API updateUser :", error);
        throw error;
    }
};

export const fetchItems = async () => {
    try {
        const response = await fetch("http://localhost:3000/items"); // Mets l'URL correcte de ton JSON Server
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        return [];
    }
};

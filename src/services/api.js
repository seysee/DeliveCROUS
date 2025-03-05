/**
 * Gestion des appels API pour la connexion utilisateur et la mise à jour des informations.
 *
 * Ce fichier contient des fonctions permettant de :
 * 1. Se connecter en vérifiant l'email et le mot de passe de l'utilisateur.
 * 2. Mettre à jour les informations d'un utilisateur existant.
 * 3. Récupérer une liste d'articles depuis une API externe.
 *
 * **Fonctions :**
 *
 * 1. **login** (email: string, password: string) : `Promise<User>`
 *    - Cette fonction envoie une requête `GET` à l'API pour récupérer la liste des utilisateurs et rechercher un utilisateur correspondant à l'email et au mot de passe fournis.
 *    - Si un utilisateur est trouvé, il est retourné. Si aucune correspondance n'est trouvée, une erreur est lancée.
 *    - La fonction retourne un objet utilisateur ou une erreur si la connexion échoue.
 *
 * 2. **updateUser** (id: string, updatedData: object) : `Promise<User>`
 *    - Cette fonction envoie une requête `PATCH` à l'API pour mettre à jour les informations d'un utilisateur en fonction de son `id` et des nouvelles données (`updatedData`) fournies.
 *    - Si la mise à jour échoue, une erreur est lancée. Si elle réussit, les données de l'utilisateur mises à jour sont retournées.
 *
 * 3. **fetchItems** () : `Promise<Item[]>`
 *    - Cette fonction envoie une requête `GET` à une autre API pour récupérer une liste d'articles.
 *    - Si la récupération réussit, elle retourne les données des articles sous forme de tableau. Si une erreur se produit, un tableau vide est retourné.
 *
 * **Détails de l'implémentation :**
 * - `API_URL` : URL de base de l'API pour l'authentification utilisateur, utilisée dans la fonction `login` et `updateUser`.
 * - L'API des utilisateurs est supposée être disponible à l'adresse `http://localhost:5000/users`.
 * - La récupération des articles se fait via l'API située à `http://localhost:3000/items`.
 *
 * **Gestion des erreurs :**
 * - Dans chaque fonction, des blocs `try/catch` sont utilisés pour capturer les erreurs potentielles lors des appels `fetch`. Si une erreur survient (par exemple, si l'API est inaccessible ou que les données sont incorrectes), celle-ci est loguée dans la console et une erreur est lancée.
 * - Les erreurs incluent des messages descriptifs, tels que "Erreur serveur", "Email ou mot de passe incorrect", et "Erreur lors de la récupération des données".
 *
 * **Exemples d'utilisation :**
 * 1. Connexion d'un utilisateur :
 *    ```javascript
 *    const user = await login('email@example.com', 'password123');
 *    console.log('Utilisateur connecté :', user);
 *    ```
 * 2. Mise à jour des informations d'un utilisateur :
 *    ```javascript
 *    const updatedUser = await updateUser(user.id, { name: 'Nouvel Nom' });
 *    console.log('Utilisateur mis à jour :', updatedUser);
 *    ```
 * 3. Récupération des articles :
 *    ```javascript
 *    const items = await fetchItems();
 *    console.log('Articles récupérés :', items);
 *    ```
 *
 * **Dépendances :**
 * - `fetch` : Fonction native permettant d'effectuer des requêtes HTTP vers les API.
 *
 * **Retour des fonctions :**
 * - La fonction `login` retourne un objet utilisateur si la connexion est réussie, ou lance une erreur si l'authentification échoue.
 * - La fonction `updateUser` retourne l'utilisateur mis à jour si la mise à jour est réussie, ou lance une erreur en cas d'échec.
 * - La fonction `fetchItems` retourne un tableau d'articles ou un tableau vide en cas d'erreur.
 */

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
        const response = await fetch("http://localhost:3000/items");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        return [];
    }
};

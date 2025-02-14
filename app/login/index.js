import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { AuthContext } from "../../src/context/AuthContext";
import { updateUser } from "../../src/services/api";

const Index = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        return <Text>Erreur de chargement du contexte d'authentification</Text>;
    }

    const { user, signIn, signOut } = authContext;
    const [nom, setNom] = useState(user?.nom || "");
    const [prenom, setPrenom] = useState(user?.prenom || "");
    const [email, setEmail] = useState(user?.email || "");
    const [isEditing, setIsEditing] = useState(false);
    const [password, setPassword] = useState("")


    const handleLogin = async () => {
        try {
            await signIn(email, password);
            Alert.alert("Connexion réussie !");
        } catch (error) {
            Alert.alert("Erreur", error.message);
        }
    };

    const handleSave = async () => {
        try {
            const updatedUser = await updateUser(user.id, { nom, prenom, email });


            await signIn(updatedUser.email, user.password);

            Alert.alert("Succès", "Informations mises à jour !");
            setIsEditing(false);
        } catch (error) {
            Alert.alert("Erreur", "Impossible de mettre à jour les informations.");
        }
    };

    const handleLogout = async () => {
        await signOut();
        Alert.alert("Déconnexion réussie !");
    };

    if (user) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Profil</Text>

                <Text>Nom :</Text>
                <TextInput
                    value={nom}
                    onChangeText={setNom}
                    editable={isEditing}
                    style={styles.input}
                />

                <Text>Prénom :</Text>
                <TextInput
                    value={prenom}
                    onChangeText={setPrenom}
                    editable={isEditing}
                    style={styles.input}
                />

                <Text>Email :</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    editable={isEditing}
                    style={styles.input}
                />

                {isEditing ? (
                    <Button title="Enregistrer" onPress={handleSave} />
                ) : (
                    <Button title="Modifier" onPress={() => setIsEditing(true)} />
                )}

                <Button title="Se déconnecter" onPress={handleLogout} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text>Email :</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                style={styles.input}
            />

            <Text>Mot de passe :</Text>
            <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            <Button title="Se connecter" onPress={handleLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        marginTop: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        borderBottomWidth: 1,
        width: 250,
        marginBottom: 10,
    },
});

export default Index;

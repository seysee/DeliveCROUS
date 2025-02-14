import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { AuthContext } from "../../src/context/AuthContext";

const Index = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        return <Text>Erreur de chargement du contexte d'authentification</Text>;
    }

    const { signIn } = authContext;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        console.log("🔵 Bouton Connexion pressé !");
        try {
            console.log("🟡 Appel de signIn...");
            await signIn(email, password);
            console.log("🟢 Connexion réussie !");
            Alert.alert("Connexion réussie !");
        } catch (error) {
            console.error("🔴 Erreur lors de la connexion :", error);
            Alert.alert("Erreur", error.message);
        }
    };

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
    input: {
        borderBottomWidth: 1,
        width: 250,
        marginBottom: 10,
    },
});

export default Index;

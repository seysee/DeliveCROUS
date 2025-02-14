import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { AuthContext } from "../../src/context/AuthContext";
import { updateUser } from "../../src/services/api";
import * as ImagePicker from 'expo-image-picker';
import { Image } from "react-native";


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
    const [password, setPassword] = useState("");
    const [photo, setPhoto] = useState(user?.photo || null);



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
            const updatedUser = await updateUser(user.id, { password, photo });

            await signIn(user.email, password);

            Alert.alert("Succès", "Mot de passe et photo mis à jour !");
            setIsEditing(false);
        } catch (error) {
            Alert.alert("Erreur", "Impossible de mettre à jour les informations.");
        }
    };



    const handleLogout = async () => {
        await signOut();
        Alert.alert("Déconnexion réussie !");
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setPhoto(result.assets[0].uri);
        }
    };


    if (user) {
        return (

            <View style={styles.container}>

                <Text style={styles.title}>Profil</Text>

                {photo && <Image source={{ uri: photo }} style={styles.profileImage} />}
                <Button title="Choisir une photo" onPress={pickImage} />


                <Text>Nom :</Text>
                <Text style={styles.info}>{user.nom}</Text>

                <Text>Prénom :</Text>
                <Text style={styles.info}>{user.prenom}</Text>

                <Text>Email :</Text>
                <Text style={styles.info}>{user.email}</Text>

                <Text>Mot de passe :</Text>
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    editable={isEditing}
                    secureTextEntry
                    style={styles.input}
                />

                {isEditing ? (
                    <Button title="Enregistrer" onPress={handleSave} />
                ) : (
                    <Button title="Modifier mot de passe" onPress={() => setIsEditing(true)} />
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
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },

});

export default Index;

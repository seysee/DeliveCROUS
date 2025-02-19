import React, { useState, useContext } from "react";
import { View, Text, Alert, StyleSheet, Pressable, Animated, Image, useWindowDimensions } from "react-native";
import { AuthContext } from "../../src/context/AuthContext";
import { updateUser } from "../../src/services/api";
import * as ImagePicker from 'expo-image-picker';
import { useEffect } from "react";
import Button from "../../src/components/Button";
import Input from "../../src/components/Input";

const Index = () => {
    const { width, height } = useWindowDimensions()
    const isLandscape = width > height

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
        console.log("Tentative de connexion...");
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
           mediaTypes: ["image"],
           allowsEditing: true,
           aspect: [1, 1],
           quality: 1,
       });

       if (result.assets && result.assets.length > 0) {
           const newPhoto = result.assets[0].uri;
           setPhoto(newPhoto);
           console.log("📸 Nouvelle photo mise à jour :", newPhoto);
       } else {
           console.log("⚠️ Aucune image sélectionnée");
       }
   };

    useEffect(() => {
        console.log("📸 Nouvelle photo sélectionnée :", photo);
    }, [photo]);


    if (user) {
        return (
            <View style={styles.profileContainer}>
                <Text style={styles.profileTitle}>Profil</Text>
                <Text style={styles.profileSubtitle}>Gérez vos informations personnelles</Text>

                {/* PHOTO DE PROFIL */}
                <View style={styles.profileImageContainer}>
                    {photo ? (
                        <Image source={{ uri: photo }} style={styles.profileImage} />
                    ) : (
                        <Text style={styles.profileNoPhotoText}>Aucune photo sélectionnée</Text>
                    )}
                    <Button title="Choisir une photo" onPress={pickImage} />
                </View>

                {/* INFOS PERSONNELLES*/}
                <View style={[styles.profileRow, { flexDirection: isLandscape ? 'row' : 'column' }]}>
                    <View style={[styles.profileInputContainer, { width: isLandscape ? '30%' : '80%' }]}>
                        <Input label="Nom" value={user.nom} editable={false} />
                    </View>
                    <View style={[styles.profileInputContainer, { width: isLandscape ? '30%' : '80%' }]}>
                        <Input label="Prénom" value={user.prenom} editable={false} />
                    </View>
                </View>

                <View style={[styles.profileRow, { flexDirection: isLandscape ? 'row' : 'column' }]}>
                    <View style={[styles.profileInputContainer, { width: isLandscape ? '30%' : '80%' }]}>
                        <Input label="Email" value={user.email} editable={false} />
                    </View>
                    <View style={[styles.profileInputContainer, { width: isLandscape ? '30%' : '80%' }]}>
                        <Input
                            label="Mot de passe"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholder="Entrez votre mot de passe"
                            editable={isEditing}
                        />
                    </View>
                </View>

                {/* BOUTONS */}
                {isEditing ? (
                    <Button title="Enregistrer" onPress={handleSave} />
                ) : (
                    <Button title="Modifier mot de passe" onPress={() => setIsEditing(true)} />
                )}
                <Button title="Se déconnecter" onPress={handleLogout} style={{ backgroundColor: "#333" }} />
            </View>
        );
    }
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Se connecter</Text>
                <Text style={styles.subtitle}>Bienvenue de retour !</Text>

                <View style={styles.inputContainer}>
                    <Input
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Entrez votre email"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Input
                        label="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholder="Entrez votre mot de passe"
                    />
                </View>

                <Button title="Se connecter" onPress={handleLogin} />

                <Text style={styles.footer}>
                    Pas encore de compte ? <Text style={styles.link}>Inscrivez-vous</Text>
                </Text>
            </View>
        );
};

const styles = StyleSheet.create({
    //se connecter
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontFamily: "Poppins-Bold",
        color: "#e01020",
    },
    subtitle: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        color: "#666",
        marginBottom: 30,
    },
    footer: {
        marginTop: 20,
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        color: "#666",
    },
    link: {
        color: "#e01020",
        fontFamily: "Poppins-Bold",
    },

    //profile
    profileImage:{
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom:10,
    },
    profileContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        padding: 20,
    },
    profileTitle: {
        fontSize: 28,
        fontFamily: "Poppins-Bold",
        color: "#e01020",
    },
    profileSubtitle: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        color: "#666",
        marginBottom: 30,
    },
    profileImageContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    profileNoPhotoText: {
        color: "#666",
        fontSize: 14,
        fontFamily: "Poppins-Regular",
    },
    profileRow: {
        width: "100%",
        paddingHorizontal: 10,
        gap: 15,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default Index;

import React, { useState, useContext, useRef } from "react";
import { View, Button, Text, TextInput, Alert, StyleSheet, Pressable, Animated, Image } from "react-native";
import { AuthContext } from "../../src/context/AuthContext";
import { updateUser } from "../../src/services/api";
import * as ImagePicker from 'expo-image-picker';
import { useEffect } from "react";

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

    const hoverAnim = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

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

    const handleMouseEnter = () => {
        Animated.timing(hoverAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const handleMouseLeave = () => {
        Animated.timing(hoverAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const buttonBackgroundColor = hoverAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["#e01020", "#c00d1a"],
    });



    useEffect(() => {
        console.log("📸 Nouvelle photo sélectionnée :", photo);
    }, [photo]);


    if (user) {
        return (
        <View style={styles.container}>

            <Text style={styles.title}>Profil</Text>

            {photo ? (
                <Image source={{ uri: photo }} style={styles.profileImage} />
            ) : (
                <Text style={{ color: "#666" }}>Aucune photo sélectionnée</Text>
            )}

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
                <Text style={styles.title}>Se connecter</Text>
                <Text style={styles.subtitle}>Bienvenue de retour !</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        style={styles.input}
                        placeholder="Entrez votre email"
                        placeholderTextColor="#ccc"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Mot de passe</Text>
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                        placeholder="Entrez votre mot de passe"
                        placeholderTextColor="#ccc"
                    />
                </View>

                <Pressable
                    onPress={handleLogin}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Animated.View style={[styles.button, { backgroundColor: buttonBackgroundColor }]}>
                        <Text style={styles.buttonText}>Se connecter</Text>
                    </Animated.View>
                </Pressable>

                <Text style={styles.footer}>
                    Pas encore de compte ? <Text style={styles.link}>Inscrivez-vous</Text>
                </Text>
            </View>
        );
};

const styles = StyleSheet.create({
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
    inputContainer: {
        width: 280,
        alignItems: "flex-start",
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        color: "#333",
        marginBottom: 5,
    },
    input: {
        width: "100%",
        height: 45,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: "#ddd",
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        color: "#333",
    },
    button: {
        width: 280,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
        shadowColor: "#e01020",
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "Poppins-Bold",
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
    profileImage:{
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom:10,
    },
});

export default Index;

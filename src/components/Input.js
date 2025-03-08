/*
 * Composant Input personnalisé pour l'interface utilisateur.
 *
 * Ce composant est utilisé pour afficher des champs de saisie de texte, avec un comportement flexible en fonction des props passées. Il peut afficher soit un champ `TextInput` modifiable, soit un champ de texte statique selon que le champ soit éditable ou non.
 *
 * Propriétés du composant :
 * - `label` (string, optionnel) : Le texte qui est affiché comme étiquette au-dessus du champ de saisie. Si non fourni, aucune étiquette ne sera affichée.
 * - `value` (string) : La valeur actuelle du champ de saisie. Ce champ est contrôlé par l'état du parent.
 * - `onChangeText` (fonction) : Fonction qui est appelée chaque fois que l'utilisateur modifie le texte dans le champ de saisie.
 * - `placeholder` (string, optionnel) : Le texte à afficher lorsque le champ de saisie est vide.
 * - `secureTextEntry` (bool, optionnel) : Si `true`, le texte saisi sera masqué (utile pour les mots de passe).
 * - `editable` (bool, optionnel, défaut `true`) : Définit si le champ de saisie est modifiable. Si `false`, un texte statique sera affiché à la place du `TextInput`. Ce texte sera masqué pour les champs avec `secureTextEntry`.
 *
 * Comportement du composant :
 * - Si `editable` est `true`, le composant affichera un champ de saisie `TextInput`. Ce champ peut être sécurisé (pour les mots de passe) grâce à la propriété `secureTextEntry`.
 * - Si `editable` est `false`, le composant affichera un texte statique qui représente la valeur actuelle. Si `secureTextEntry` est activé, le texte sera remplacé par des points (•) pour masquer les caractères
*/

import React from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";

const Input = ({ label, value, onChangeText, placeholder, secureTextEntry, editable = true }) => {
    const displayValue = secureTextEntry && !editable ? "•".repeat(value.length) : value;

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            {editable ? (
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#ccc"
                    secureTextEntry={secureTextEntry}
                    style={styles.input}
                />
            ) : (
                <Text style={styles.text}>{displayValue}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
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
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        color: "#333",
    },
    text: {
        fontSize: 16,
        color: "#333",
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#ddd",
    }
});

export default Input;
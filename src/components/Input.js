import React from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";

const Input = ({ label, value, onChangeText, placeholder, secureTextEntry, editable = true }) => {
    const displayValue = secureTextEntry && !editable ? "••••••••" : value;

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
        fontSize: 16,
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

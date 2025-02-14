import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PanierButton({ inCart, toggleInCart }) {
    return (
        <TouchableOpacity onPress={toggleInCart} style={styles.iconButton}>
            <Ionicons
                name={inCart ? "cart" : "cart-outline"}
                size={24}
                color={inCart ? "black" : "gray"}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    iconButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

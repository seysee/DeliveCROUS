import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function PanierButton({ inCart, toggleInCart }) {
    return (
        <TouchableOpacity onPress={toggleInCart} style={styles.iconButton}>
            <FontAwesome5
                name="shopping-cart"
                size={18}
                color={inCart ? "black" : "gray"}
                solid
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

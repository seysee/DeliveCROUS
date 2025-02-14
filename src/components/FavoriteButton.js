import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FavoriButton({ isFavorited, toggleIsFavorited }) {
    return (
        <TouchableOpacity onPress={toggleIsFavorited} style={styles.iconButton}>
            <Ionicons
                name={isFavorited ? "heart" : "heart-outline"}
                size={24}
                color={isFavorited ? "red" : "gray"}
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

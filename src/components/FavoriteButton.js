import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function FavoriButton({ isFavorited, toggleIsFavorited }) {
    return (
        <TouchableOpacity onPress={toggleIsFavorited} style={styles.iconButton}>
            <FontAwesome5
                name={isFavorited ? "heart" : "heart-broken"}
                size={18}
                color={isFavorited ? "red" : "gray"}
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

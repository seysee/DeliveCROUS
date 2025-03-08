/*
 * Composant FavoriButton
 *
 * Ce composant représente un bouton qui permet à l'utilisateur d'ajouter ou de retirer un élément des favoris.
 * Il utilise l'icône du cœur d'Ionicons, changeant de style en fonction de l'état "favori" de l'élément.
 * Lorsqu'on clique sur le bouton, il appelle la fonction `toggleIsFavorited` pour inverser l'état du favori.
 *
 * Propriétés (props) :
 * - `isFavorited` (boolean) : Détermine si l'élément est actuellement favori ou non. Si la valeur est `true`, l'icône affichée sera un cœur plein, et si elle est `false`, un cœur vide (outline) sera affiché.
 * - `toggleIsFavorited` (function) : Fonction appelée lorsque l'utilisateur appuie sur le bouton. Elle doit gérer l'inversion de l'état `isFavorited`, permettant ainsi d'ajouter ou de retirer un élément des favoris.
 *
 * Comportement :
 * - Lorsqu'un utilisateur clique sur l'icône, l'état `isFavorited` change. Si l'élément est déjà dans les favoris, l'icône se transforme en cœur vide, et si l'élément n'est pas encore dans les favoris, l'icône devient un cœur rempli.
 * - La couleur de l'icône change également en fonction de l'état : rouge lorsque l'élément est favori, gris lorsque ce n'est pas le cas.
 *
 * Composants utilisés :
 * - `TouchableOpacity` : Un composant de React Native qui permet de rendre une zone cliquable. Il est utilisé ici pour détecter l'appui sur le bouton.
 * - `Ionicons` : Un composant d'Expo qui permet d'afficher des icônes. L'icône de cœur est utilisée ici pour représenter l'état favori.
 * - `StyleSheet` : Un utilitaire de React Native pour définir des styles.
 *
 */

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
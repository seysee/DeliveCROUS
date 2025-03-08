/**
 * Composant PanierButton
 *
 * Ce composant représente un bouton d'icône permettant d'ajouter ou de retirer un article du panier. Il affiche un panier (icône de "cart") avec une variation de style en fonction de l'état de l'élément dans le panier (ajouté ou non).
 *
 * Propriétés :
 * - `inCart` (booléen) : Un état qui détermine si l'article est déjà dans le panier ou non. Si l'article est dans le panier, l'icône affichera un panier rempli ("cart"), sinon, elle affichera un panier vide ("cart-outline").
 * - `toggleInCart` (fonction) : Une fonction appelée lorsqu'on appuie sur le bouton. Elle permet de basculer l'état de `inCart`, c'est-à-dire d'ajouter ou de retirer l'article du panier.
 *
 * Fonctionnement :
 * - Lorsque l'utilisateur clique sur l'icône du panier, la fonction `toggleInCart` est appelée, ce qui permet de basculer l'état `inCart`. En fonction de cet état, l'icône du panier changera entre "cart" (panier rempli) et "cart-outline" (panier vide).
 *
 * Comportement :
 * - Si l'article est dans le panier (`inCart` est `true`), l'icône de panier pleine (`cart`) sera affichée avec une couleur noire.
 * - Si l'article n'est pas dans le panier (`inCart` est `false`), l'icône de panier vide (`cart-outline`) sera affichée avec une couleur grise.
 *
*/

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
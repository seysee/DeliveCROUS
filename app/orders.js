/**
 * Page des commandes dans l'application.
 *
 * Elle est une simple vue qui fait partie de l'interface utilisateur, permettant de présenter la liste des commandes d'un utilisateur ou d'autres informations pertinentes liées aux commandes.
 *
 */

import { View, Text, StyleSheet, Button } from 'react-native';
import { Link } from 'expo-router';

const OrdersPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Page des Commandes</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default OrdersPage;

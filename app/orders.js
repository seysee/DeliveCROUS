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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default OrdersPage;

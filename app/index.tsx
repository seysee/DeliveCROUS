import { View, Text, StyleSheet } from "react-native";

const Page = () => {
  return (
    <View style={styles.main}>
      <Text style={styles.title}>Hello World</Text>
      <Text style={styles.subtitle}>This is the first page of your app.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 960,
    width: "100%",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});

export default Page;

import * as React from "react";
import { ActivityIndicator, StyleSheet, Text, View, ImageBackground } from "react-native";
export default function StartScreen() {
  return (
    <View style={styles.container}>
    <ImageBackground source={require('../assets/images/start.jpg')} resizeMode="cover" style={styles.image}>
      <ActivityIndicator size="large" color="orange" />
    </ImageBackground>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  text: {
    color: "white",
    fontSize: 42,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0"
  }
});

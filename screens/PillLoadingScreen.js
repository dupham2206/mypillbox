import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import TurnBack from "../src/component/TurnBackView";
import FoundationIcon from 'react-native-vector-icons/Foundation';
import { useGlobalState, SCREEN_STATES } from "../src/component/GlobalHook";

export default function PillLoadingScreen({handleReset}) {
  const [tipUse, setTipUse] = useGlobalState('tipUse')

  return (
    <View style={styles.container}>
      <TurnBack backgroundColorText={styles.tipContainer.backgroundColor} colorText="black" text="Trích xuất các viên thuốc" handleReset={handleReset}/>
      <View style={styles.tipContainer}>
        <View style={styles.bulbIcon}>
          <FoundationIcon name="lightbulb" size={90} color='#34D7BE' />
        </View>
        <Text style={styles.tip}>{tipUse}</Text>
      </View>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.loadingText}>Hãy đợi vài giây để chúng tôi trích xuất thông tin những viên thuốc cần uống của bạn</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    height: "35%",
    justifyContent: "center"
  },
  loadingText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    marginLeft: 30,
    marginRight: 30,
    textAlign: "center",
  },
  tip: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    margin: "10%",
    marginTop: "10%",
  },
  tipContainer: {
    backgroundColor: "white",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    height: "55%",
    alignItems: "center"
  },
  bulbIcon: {
    marginTop: "5%",
  }
});

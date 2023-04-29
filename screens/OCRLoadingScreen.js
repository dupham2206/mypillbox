import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ProgressCircle from 'react-native-progress/Circle';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import LinearGradient from 'react-native-linear-gradient';
import { useGlobalState, SCREEN_STATES } from "../src/component/GlobalHook";
import TurnBack from '../src/component/TurnBackView';
import TesseractOcr, {
  LANG_ENGLISH,
  LANG_VIETNAMESE,
  useEventListener,
} from 'react-native-tesseract-ocr';

export default function OCRLoadingScreen({handleCancelOCR}) {
  const [progress, setProgress] = useGlobalState('progressOCR');
  const [tipUse, setTipUse] = useGlobalState('tipUse');

  useEventListener('onProgressChange', p => {
    setProgress(p.percent / 100);
  });

  return (
    <View style={styles.container}>
      <TurnBack backgroundColorText={styles.tipContainer.backgroundColor} colorText="black" text="Trích xuất thông tin đơn thuốc" handleReset={handleCancelOCR}/>
      <View style={styles.tipContainer}>
        <View style={styles.bulbIcon}>
          <FoundationIcon name="lightbulb" size={90} color='#34D7BE' />
        </View>
        <Text style={styles.tip}>{tipUse}</Text>
      </View>
      <View style={styles.progressContainer}>
        <ProgressCircle size={140} thickness={20} textStyle={{ fontSize: 40 }} showsText progress={progress} color="white"/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tip: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    margin: "10%",
    marginTop: "5%",

  },
  tipContainer: {
    backgroundColor: "white",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    height: "55%",
    alignItems: "center"
  },
  progressContainer: {
    height: "35%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  bulbIcon: {
    marginTop: "5%",
  }
});
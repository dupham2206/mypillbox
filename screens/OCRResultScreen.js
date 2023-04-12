import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import OCRInformation from '../src/component/OCRInformation';
import Swiper from 'react-native-swiper';
import TurnBack from '../src/component/TurnBackView';
import { useGlobalState, SCREEN_STATES } from "../src/component/GlobalHook";

export default function OCRResultScreen() {
  const [OCRData, setOCRData] = useGlobalState('OCRData');

  return (
    <View style={styles.container}>
      <TurnBack backgroundColorText={null} colorText="white" text="Đặt lịch uống thuốc" />
      <Swiper style={styles.swiper} showsButtons={true}>
        {OCRData.map((name, index) => {
          return (<OCRInformation index={index} key={index} />);
        })}
      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  swiper: {
    // marginTop: "10%",
  }
});
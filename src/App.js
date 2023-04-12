import * as React from 'react';
import { useCallback, useState, useEffect } from 'react';
import { StyleSheet, Text } from "react-native";
import { SafeAreaView, View } from 'react-native-safe-area-context';
import PillCameraScreen from '../screens/PillCameraScreen';
import PillLoadingScreen from '../screens/PillLoadingScreen';
import PillResultsScreen from '../screens/PillResultsScreen';
import StartScreen from '../screens/StartScreen';
import HomePage from '../screens/HomePage';
import OCRStartScreen from '../screens/OCRStartScreen'
import OCRLoadingScreen from '../screens/OCRLoadingScreen';
import OCRResultScreen from '../screens/OCRResultScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import SearchPillScreen from '../screens/SearchPillScreen';
import SearchPillDetailScreen from '../screens/SearchPillDetailScreen';
import TipScreen from '../screens/TipScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogBox } from 'react-native';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import { scheduleNotification } from './component/Notification';
import {
  media,
  MobileModel,
  torch,
} from 'react-native-pytorch-core';
import { useGlobalState, SCREEN_STATES } from './component/GlobalHook';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications


let modelSingle = null
let modelMultiple = null

export default function App() {
  const [screenState, setScreenState] = useGlobalState('screenState');
  const [modelSingleState, setModelSingleState] = useGlobalState('modelSingleState')
  const [modelMultipleState, setModelMultipleState] = useGlobalState('modelMultipleState')
  const [image, setImage] = useGlobalState('image');
  const [boundingBoxes, setBoundingBoxes] = useGlobalState('boundingBoxes');



  async function loadModelSingle() {
    const MODEL_SINGLE_CLASS_URL = require("../assets/yolov7_45_deg_40_gen_singlecls4.torchscript.ptl")
    console.log('Loading model single class...')
    const path_single = await MobileModel.download(MODEL_SINGLE_CLASS_URL)
    let model_single = await torch.jit._loadForMobile(path_single)
    console.log('loading suscessful')
    return model_single
  }

  async function loadModelMultiple() {
    const MODEL_MULTIPLE_CLASS_URL = require('../assets/yolov74.torchscript.ptl')
    // const MODEL_MULTIPLE_CLASS_URL = require('../assets/yolov7_45_deg_40_gen.torchscript.ptl')
    console.log('Loading model multiple class...')
    const path_multiple = await MobileModel.download(MODEL_MULTIPLE_CLASS_URL)
    let model_multiple = await torch.jit._loadForMobile(path_multiple)
    console.log('loading successful')
    return model_multiple
  }

  async function loadModel() {
    modelMultiple = await loadModelMultiple()
    setModelMultipleState(modelMultiple)
    modelSingle = await loadModelSingle()
    setModelSingleState(modelSingle)
    setScreenState(SCREEN_STATES.SEARCH_PILL)
    // AsyncStorage.removeItem('@schedule');
  }

  const handleResetPill = useCallback(async () => {
    setScreenState(SCREEN_STATES.HOMEPAGE);
    if (image != null) {
      await image.release();
    }
    setImage(null);
    setBoundingBoxes(null);
    setModelMultipleState(null);
    setModelMultipleState(modelMultiple);
    setModelSingleState(null)
    setModelSingleState(modelSingle);
  }, [image, setScreenState]);

  useEffect(() => {
    loadModel()
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      <LinearGradient style={styles.container} colors={['#339DAD', '#34D7BE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        {screenState === SCREEN_STATES.START && <StartScreen />}
        {screenState === SCREEN_STATES.HOMEPAGE && <HomePage />}
        {screenState === SCREEN_STATES.PILL_CAMERA && (<PillCameraScreen handleReset={handleResetPill} />)}
        {screenState === SCREEN_STATES.PILL_LOADING && <PillLoadingScreen />}
        {screenState === SCREEN_STATES.PILL_RESULTS && (<PillResultsScreen onReset={handleResetPill} />)}
        {screenState === SCREEN_STATES.OCR_START && <OCRStartScreen />}
        {screenState === SCREEN_STATES.OCR_LOADING && <OCRLoadingScreen />}
        {screenState === SCREEN_STATES.OCR_RESULT && <OCRResultScreen />}
        {screenState === SCREEN_STATES.SCHEDULE && <ScheduleScreen />}
        {screenState === SCREEN_STATES.TIP && <TipScreen />}
        {screenState === SCREEN_STATES.SEARCH_PILL && <SearchPillScreen />}
        {screenState === SCREEN_STATES.SEARCH_PILL_DETAIL && <SearchPillDetailScreen />}
        <Toast />
      </LinearGradient>
    </SafeAreaView>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34D7BE',
  },
  camera: {
    height: 400
  }
});



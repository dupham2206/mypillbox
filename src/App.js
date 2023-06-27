import * as React from 'react';
import { useCallback, useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text } from "react-native";
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
  const [OCRData, setOCRData] = useGlobalState('OCRData')
  const [cancel, setCancel] = useState(false);
  const [processPillDone, setProcessPillDone] = useState(false);
  const [processPresDone, setProcessPresDone] = useState(false);




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
    if (modelMultiple == null) {
      modelMultiple = await loadModelMultiple()
      setModelMultipleState(modelMultiple)
    }
    if (modelSingle == null) {
      modelSingle = await loadModelSingle()
      setModelSingleState(modelSingle)
    }
    if (screenState === SCREEN_STATES.START) {
      setScreenState(SCREEN_STATES.HOMEPAGE)
    }
    // AsyncStorage.removeItem('@schedule');
  }

  const handleResetPill = useCallback(async () => {
    setScreenState(SCREEN_STATES.HOMEPAGE);
    resetPill();
  }, [image]);

  const handleCancelPill = async () => {
    setCancel(true)
    setScreenState(SCREEN_STATES.HOMEPAGE);
    resetPill();
  }

  const resetPill = async () => {
    if (image != null) {
      await image.release();
    }
    setImage(null);
    setBoundingBoxes(null);
    setModelMultipleState(null);
    setModelMultipleState(modelMultiple);
    setModelSingleState(null)
    setModelSingleState(modelSingle);
  }

  const handleResetOCR = useCallback(async () => {
    setScreenState(SCREEN_STATES.HOMEPAGE);
    resetOCR();
  }, [image]);

  const handleCancelOCR = async () => {
    setCancel(true)
    setScreenState(SCREEN_STATES.HOMEPAGE);
    resetOCR();
  }

  const resetOCR = () => {
    setOCRData([]);
  }

  useEffect(() => {
    loadModel()
    if (processPillDone) {
      setProcessPillDone(false)
      if (cancel == false) {
        setScreenState(SCREEN_STATES.PILL_RESULTS)
      }
      setCancel(false)
    }
    if (processPresDone) {
      setProcessPresDone(false)
      if (cancel == false) {
        setScreenState(SCREEN_STATES.OCR_RESULT)
      }
      setCancel(false)
    }
  }, [processPillDone, processPresDone]);


  return (
    <SafeAreaView style={styles.container}>

      <LinearGradient style={styles.container} colors={['#339DAD', '#34D7BE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        {screenState === SCREEN_STATES.START && <StartScreen />}
        {screenState === SCREEN_STATES.HOMEPAGE && <HomePage />}
        {screenState === SCREEN_STATES.PILL_CAMERA && (<PillCameraScreen handleReset={handleResetPill} setProcessPillDone={setProcessPillDone} />)}
        {screenState === SCREEN_STATES.PILL_LOADING && <PillLoadingScreen handleReset={handleCancelPill} />}
        {screenState === SCREEN_STATES.PILL_RESULTS && (<PillResultsScreen onReset={handleResetPill} />)}
        {screenState === SCREEN_STATES.OCR_START && <OCRStartScreen handleResetOCR={handleResetOCR} setProcessPresDone={setProcessPresDone} />}
        {screenState === SCREEN_STATES.OCR_LOADING && <OCRLoadingScreen handleCancelOCR={handleCancelOCR}/>}
        {screenState === SCREEN_STATES.OCR_RESULT && <OCRResultScreen handleResetOCR={handleResetOCR}/>}
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



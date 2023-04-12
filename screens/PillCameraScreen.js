import * as React from "react";
import { useRef } from "react";
import { StyleSheet } from "react-native";
import { Camera } from "react-native-pytorch-core";
import { useGlobalState, SCREEN_STATES } from "../src/component/GlobalHook";
import detectObjects from "../src/pill_recognition/ObjectDetector";
import PoseProcessing from "../src/pill_recognition/PoseProcessing";
const tip = require('../assets/tip.json')


export default function PillCameraScreen({handleReset}) {
  const cameraRef = useRef(null);
  const [tipUse, setTipUse] = useGlobalState('tipUse');
  const [screenState, setScreenState] = useGlobalState('screenState');
  const [image, setImage] = useGlobalState('image');
  const [boundingBoxes, setBoundingBoxes] = useGlobalState('boundingBoxes');
  const [modelSingleState, setModelSingleState] = useGlobalState('modelSingleState')
  const [modelMultipleState, setModelMultipleState] = useGlobalState('modelMultipleState')


  const takeTip = () => {
    let randTip = Math.floor(Math.random() * tip.length);
    setTipUse(tip[randTip])
  }

  async function handleImage(capturedImage) {
    takeTip();
    setScreenState(SCREEN_STATES.PILL_LOADING);
    setImage(capturedImage);
    // Wait for image to process through YOLOv7 model and draw resulting image
    try {
      const multiple_class_boxes = await detectObjects(capturedImage, modelMultipleState);
      const single_class_boxes = await detectObjects(capturedImage, modelSingleState);
      const post_process_boxes = PoseProcessing(single_class_boxes, multiple_class_boxes);
      setBoundingBoxes(post_process_boxes);

      // Switch to the PillResultsScreen to display the detected objects
      setScreenState(SCREEN_STATES.PILL_RESULTS);
    } catch (err) {
      console.log(err)
      // In case something goes wrong, go back to the PillCameraScreen to take a new picture
      handleReset();
    }
  }
  
  return (
    <Camera
      ref={cameraRef}
      style={styles.camera}
      onCapture={handleImage}
      targetResolution={{ width: 1080, height: 1920 }}
    />
  );
}

const styles = StyleSheet.create({
  camera: { width: "100%", height: "100%" },
});

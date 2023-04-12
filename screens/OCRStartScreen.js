import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Fontisto from 'react-native-vector-icons/Fontisto';
import LinearGradient from 'react-native-linear-gradient';
import TurnBack from '../src/component/TurnBackView';
import ButtonHomePage from '../src/component/ButtonHomePage';
import { useGlobalState, SCREEN_STATES } from "../src/component/GlobalHook";
import { takeTip, processOCR } from '../src/ocr/OCRProcess';
import TesseractOcr, {
    LANG_ENGLISH,
    LANG_VIETNAMESE,
    useEventListener,
  } from 'react-native-tesseract-ocr';
  
const DEFAULT_HEIGHT = 1070;
const DEFAULT_WIDTH = 760;

const defaultPickerOptions = {
    cropping: true,
    height: DEFAULT_HEIGHT,
    width: DEFAULT_WIDTH,
};

export default function OCRStartScreen() {
    const [progress, setProgress] = useGlobalState('progressOCR');
    const [screenState, setScreenState] = useGlobalState('screenState');
    const [OCRData, setOCRData] = useGlobalState('OCRData')
    const [tipUse, setTipUse] = useGlobalState('tipUse')
    const [imgSrc, setImgSrc] = useState(null);

    const recognizeFromPicker = async () => {
        try {
            const image = await ImagePicker.openPicker(defaultPickerOptions);
            setImgSrc({ uri: image.path });
            await recognizeTextFromImage(image.path);
        } catch (err) {
            if (err.message !== 'User cancelled image selection') {
                console.error(err);
            }
        }
    };

    const recognizeFromCamera = async () => {
        try {
            const image = await ImagePicker.openCamera(defaultPickerOptions);
            setImgSrc({ uri: image.path });
            await recognizeTextFromImage(image.path);
        } catch (err) {
            if (err.message !== 'User cancelled image selection') {
                console.error(err);
            }
        }
    };

    const recognizeTextFromImage = async (path) => {
        setScreenState(SCREEN_STATES.OCR_LOADING);
        takeTip(setTipUse);
        try {
            const tesseractOptions = {};
            let recognizedText = await TesseractOcr.recognize(
                path,
                LANG_VIETNAMESE,
                tesseractOptions,
            );
            processOCR(recognizedText, OCRData, setOCRData);
            if (OCRData.length === 0) {
                setProgress(0);
                setScreenState(SCREEN_STATES.OCR_START);
                return;
            }
        } catch (err) {
            console.error(err);
        }

        setScreenState(SCREEN_STATES.OCR_RESULT);
        setProgress(0);
        return;
    };

    return (
        <View style={styles.container}>
            <TurnBack colorText={styles.title.color} backgroundColorText={null} text="Chọn ảnh đơn thuốc"/>
            <View style={styles.header}>
                <Fontisto name="prescription" size={120} style={styles.icon} color='white' />
                <Text style={styles.title}>Trích xuất{'\n'}đặc trưng{'\n'}từ đơn thuốc</Text>
            </View>
            <View style={styles.buttons}>
                <Text style={styles.instructions}>Chọn ảnh{'\n'}đơn thuốc</Text>
                <ButtonHomePage name="Máy ảnh" navigateFuntion={recognizeFromCamera} />
                <ButtonHomePage name="Thư viện ảnh" navigateFuntion={recognizeFromPicker} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttons: {
        height: "60%",
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: "white",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    title: {
        color: "white",
        fontWeight: "bold",
        marginTop: "20%",
        fontSize: 35,
    },
    instructions: {
        marginTop: 35,
        width: "100%",
        height: "20%",
        textAlign: 'center',
        color: 'black',
        marginBottom: 5,
        fontSize: 30,
        fontWeight: "bold",
    },
    header: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        height: "35%",
        marginBottom: "10%",
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    icon: {
        marginTop: "20%",
        marginRight: "5%",
        marginLeft: "10%",
    },
});

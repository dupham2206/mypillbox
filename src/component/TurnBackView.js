import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import * as React from 'react';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { color } from 'react-native-reanimated';
import { useGlobalState, SCREEN_STATES } from "./GlobalHook";

export default function TurnBack({ backgroundColorText, colorText, handleReset, text, backState}) {
    const [screenState, setScreenState] = useGlobalState('screenState');

    const changeBackScreen = () => {
        if (handleReset == undefined && backState == undefined)
            setScreenState(SCREEN_STATES.HOMEPAGE)
        else if (handleReset == undefined && backState !== undefined)
            setScreenState(backState)
        else
            handleReset()
    }
    return (
        <View style={[styles.container, { backgroundColor: backgroundColorText }]}>
            <TouchableOpacity style={styles.touch} onPress={changeBackScreen}>
                <Ionicons name="chevron-back-outline" size={30} color={colorText} />
                <Text style={[styles.text, { color: colorText }]}>{text}</Text>
                <Ionicons name="chevron-back-outline" size={30} color={backgroundColorText} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "12%",
    },
    touch: {
        width: "100%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    text: {
        fontSize: 22,
        textAlign: "center",
        fontWeight: "bold",
    }

})
import * as React from 'react';
import { useCallback, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TurnBack from '../src/component/TurnBackView';
import { useGlobalState, SCREEN_STATES } from "../src/component/GlobalHook";


const tip = require('../assets/tip.json')

export default function TipScreen() {
    const [screenState, setScreenState] = useGlobalState('screenState');

    return (
        <View style={styles.container}>
            <TurnBack backgroundColorText={null} colorText="white" text="Tip sức khỏe" />
            <ScrollView style={{backgroundColor: "white"}}>
                {tip.map((value, index) => {
                    return (
                        <View style={styles.card} key={index}>
                            <Text style={styles.text}>{value}</Text>
                        </View>
                    )
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 20,
    },
    card: {
        marginLeft: "5%",
        marginRight: "5%",
        padding: "5%",
        marginTop: 20,
        borderColor: "#34D7BE",
        borderWidth: 3,
        borderRadius: 20,
    },
    turnback: {
        height: 10,
    }
})
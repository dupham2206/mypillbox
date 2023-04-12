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
            <TurnBack backgroundColorText={null} colorText="white" text="Tip sức khỏe"/>
            <ScrollView>
                {tip.map((value, index) => {
                    return (
                        <Card style={styles.card} key={index}>
                            <Card.Content>
                                <View>
                                    <Text style={styles.text}>{value}</Text>
                                </View>
                            </Card.Content>
                        </Card>
                    )
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        fontSize: 20,
    },
    card: {
        marginLeft: "5%",
        marginRight: "5%",
        marginTop: 20,
    },
    turnback: {
        height: 10,
    }
})
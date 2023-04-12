import * as React from 'react';
import { useCallback, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TurnBack from '../src/component/TurnBackView';
import { useGlobalState, SCREEN_STATES } from "../src/component/GlobalHook";



let curDate = new Date()

const dateToStringYMD = (date) => {
    let month = date.getMonth() + 1; //months from 1-12
    let day = date.getDate();
    let year = date.getFullYear();
    let newdate = year + "-" + month + "-" + day;
    return newdate
}
const datetoStringHM = (date) => {
    let hour = date.getHours().toString()
    if (hour.length == 1) hour = '0' + hour
    let minute = date.getMinutes().toString()
    if (minute.length == 1) minute = '0' + minute
    let newtime = hour + "h" + minute;
    return newtime
}

export default ScheduleScreen = () => {
    const [items, setItems] = React.useState({});
    const [screenState, setScreenState] = useGlobalState('screenState');


    const renderItem = (item) => {
        content = ""
        if (item.is_morning) {
            let hour = datetoStringHM(new Date(item.time_morning))
            content += "Sáng " + hour + " : " + item.number_morning + " viên"
            content += "\n"
        }
        if (item.is_noon) {
            let hour = datetoStringHM(new Date(item.time_noon))
            content += "Chiều " + hour + " : " + item.number_noon + " viên"
            content += "\n"
        }
        if (item.is_night) {
            let hour = datetoStringHM(new Date(item.time_night))
            content += "Tối " + hour + " : " + item.number_night + " viên"
        }
        return (
            <TouchableOpacity style={styles.item}>
                <Card>
                    <Card.Content>
                        <View>
                            <Text style={{fontSize: 25, fontWeight: "bold"}}>{item.drug_name}</Text>
                            <Text style={{fontSize: 18}}>{content}</Text>
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    }
    const loadData = async () => {
        let value = await AsyncStorage.getItem('@schedule');
        if (value !== null) {
            value = JSON.parse(value);
            setItems(value)
        }
    }
    useEffect(() => {
        loadData()
    }, []);

    return (
        <View style={styles.container}>
            <TurnBack backgroundColorText={null} colorText="white" text="Quản lý uống thuốc" />
            <Agenda
                items={items}
                selected={dateToStringYMD(curDate)}
                refreshControl={null}
                showClosingKnob={false}
                refreshing={false}
                renderItem={renderItem}
                theme={{
                    agendaTodayColor: 'red',
                }}
            />
            <StatusBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
});
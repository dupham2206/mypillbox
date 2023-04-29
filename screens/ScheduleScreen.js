import * as React from 'react';
import { useCallback, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TurnBack from '../src/component/TurnBackView';
import { useGlobalState, SCREEN_STATES } from "../src/component/GlobalHook";
import { dateToStringYMD, dateToStringHM, dateToStringDMY } from '../src/ocr/dateToString';
import RNMonthly from '../src/lib_calendar/RNMonthly';
import Swiper from 'react-native-swiper';
import { pillInfo } from '../assets/pill_info';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { act } from 'react-test-renderer';

let curDate = new Date()



export default ScheduleScreen = () => {
    const [items, setItems] = React.useState({});
    const [chooseDay, setChooseDay] = useGlobalState('dayChoose')
    const [chooseDate, setChooseDate] = React.useState(new Date(curDate));
    const [today, setToday] = React.useState(curDate.getUTCDate())
    const [numberOfDays, setNumberOfDays] = React.useState(getDaysInMonth(curDate.getMonth() + 1, curDate.getUTCFullYear()))
    const [activeDays, setACtiveDays] = React.useState([])

    const changeMonth = (direction) => {
        month = chooseDate.getUTCMonth() + 1
        year = chooseDate.getUTCFullYear()
        if (direction == 1) {
            if (month == 12) {
                month = 1
                year = year + 1
            }
            if (month != 12) {
                month = month + 1
            }
        }
        if (direction == -1) {
            if (month == 1) {
                month = 12
                year = year - 1
            }
            if (month != 1)
                month = month - 1
        }
        setChooseDay(1)
        chooseDate.setDate(1)
        chooseDate.setMonth(month - 1)
        chooseDate.setFullYear(year)
        setChooseDate(chooseDate)

        setNumberOfDays(getDaysInMonth(chooseDate.getUTCMonth() + 1, chooseDate.getUTCFullYear()))
        setACtiveDays(getActiveDayInMonth(chooseDate.getUTCMonth() + 1, chooseDate.getUTCFullYear()))
        // if (curDate.getUTCMonth() == chooseDate.getUTCMonth() && curDate.getUTCFullYear() == chooseDate.getUTCFullYear()){
        //     setToday(curDate.getUTCDate())
        // }
        // else
        //     setToday(null)

    }
    function getActiveDayInMonth(month, year, value = null) {
        if (value === null) {
            value = items
        }
        results = []
        start = 1
        end = getDaysInMonth(month, year)
        date = new Date()
        date.setMonth(month - 1)
        date.setFullYear(year)
        for (let i = start; i <= end; ++i) {
            date.setDate(i)
            key = dateToStringYMD(date)
            if (value[key] != undefined)
                results.push(i)
        }
        return results
    }
    function getDaysInMonth(month, year) {
        // Create a new Date object with the given month and year (the day is not important)
        month = month - 1;
        let date = new Date(year, month, 1);

        // Set the date to the last day of the month
        date.setMonth(date.getMonth() + 1);
        date.setDate(date.getDate() - 1);

        // Return the number of days in the month
        return date.getDate();
    }
    const getDrugInfo = () => {
        // if (chooseDay == null) {
        //     // return <Text>Hãy chọn ngày ở bên dưới!</Text>
        //     setChooseDay(curDate.getUTCDate())
        // }
        console.log(chooseDate)
        let curDateForDrug = chooseDate
        curDateForDrug.setDate(chooseDay)
        curDateString = dateToStringYMD(curDateForDrug)
        if (curDateString in items) {
            let curDrug = items[curDateString]
            let data = curDrug.map((value, index) => {
                return <View style={[styles.container, { flexDirection: "row" }]} key={index}>
                    <View style={styles.imageContainer}>
                        <Image source={pillInfo[parseInt(value.id[0]) + 1].link_image} resizeMode="cover" style={styles.image} />
                    </View>
                    <View style={styles.pillInfoContainer}>
                        <Text style={styles.textHeader}>Tên thuốc</Text>
                        <Text style={styles.textContent}>{value.drug_name}</Text>
                        <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                            <Text style={styles.textHeader}>Buổi</Text>
                            <Text style={styles.textHeader}>Số viên</Text>
                            <Text style={styles.textHeader}>Giờ uống</Text>
                        </View>
                        {value.is_morning === true && <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                            <Text style={[styles.textContent]}>Sáng  </Text>
                            <Text style={[styles.textContent]}>{value.number_morning}</Text>
                            <Text style={[styles.textContent]}>{dateToStringHM(new Date(value.time_morning))}</Text>
                        </View>}
                        {value.is_noon === true && <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                            <Text style={[styles.textContent]}>Chiều</Text>
                            <Text style={[styles.textContent]}>{value.number_noon}</Text>
                            <Text style={[styles.textContent]}>{dateToStringHM(new Date(value.time_noon))}</Text>
                        </View>}
                        {value.is_night === true && <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                            <Text style={[styles.textContent]}>Tối     </Text>
                            <Text style={[styles.textContent]}>{value.number_night}</Text>
                            <Text style={[styles.textContent]}>{dateToStringHM(new Date(value.time_night))}</Text>
                        </View>}

                    </View>
                </View>
            })
            return <Swiper key={dateToStringYMD(chooseDate)}>{data}</Swiper>
        }
        else {
            return <View style={[styles.pillInfoContainer, { width: "100%", margin: "10%", paddingTop: "30%" }]}>
                <Text style={styles.textHeader}>Bạn không có thuốc nào cần uống trong {dateToStringDMY(chooseDate)}</Text>
            </View>
        }
    }

    const loadData = async () => {
        if (Object.keys(items).length == 0) {
            let value = await AsyncStorage.getItem('@schedule');
            if (value !== null) {
                value = JSON.parse(value);
                setItems(value)
            }
            setACtiveDays(getActiveDayInMonth(chooseDate.getUTCMonth() + 1, chooseDate.getUTCFullYear(), value))
        }
    }
    useEffect(() => {
        loadData()
    });

    return (
        <View style={styles.container}>
            <TurnBack backgroundColorText={null} colorText="white" text="Quản lý uống thuốc" />
            <View style={[styles.container, { backgroundColor: "white" }]}>
                <View style={styles.pillContainer}>
                    {getDrugInfo()}
                </View>
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <Text style={[styles.textHeader, {color: "#34D7BE", fontWeight: "bold"}]}>{dateToStringDMY(chooseDate)}</Text>
                </View>
                <View style={styles.monlyContainer}>
                    <RNMonthly
                        numberOfDays={numberOfDays}
                        activeBackgroundColor="#34D7BE"
                        inactiveBackgroundColor="#f1f1f1"
                        today={chooseDay}
                        activeDays={activeDays}
                    />
                    <View style={styles.swipeMonth}>
                        <TouchableOpacity style={styles.touch} onPress={() => changeMonth(-1)}>
                            <FontAwesome name="chevron-left" size={30} color="#34D7BE" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.touch} onPress={() => changeMonth(1)}>
                            <FontAwesome name="chevron-right" size={30} color="#34D7BE" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    // item: {
    //     flex: 1,
    //     borderRadius: 5,
    //     padding: 10,
    //     marginRight: 10,
    //     marginTop: 17
    // },
    pillContainer: {
        height: "50%"
    },
    imageContainer: {
        width: "25%",
        height: "75%",
        marginLeft: "5%",
        marginRight: "5%",
    },
    image: {
        flex: 1,
        height: null,
        width: null,
        height: "75%",
        resizeMode: 'contain'
    },
    pillInfoContainer: {
        width: "60%",
        height: "100%",
        marginRight: "5%",
        marginTop: "10%",
    },
    textHeader: {
        fontSize: 18,
    },
    textContent: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#34D7BE",
        marginBottom: "5%",
    },
    monlyContainer: {
        width: "100%",
    },
    swipeMonth: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: "5%",
    }
});

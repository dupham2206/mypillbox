import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, Switch, Card, Button } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { scheduleNotification } from './Notification';
import { useGlobalState, SCREEN_STATES } from "./GlobalHook";

const datetoStringHM = (date) => {
  let hour = date.getHours().toString()
  if (hour.length == 1) hour = '0' + hour
  let minute = date.getMinutes().toString()
  if (minute.length == 1) minute = '0' + minute
  let newtime = hour + ":" + minute;
  return newtime
}

export default function OCRInformation({ index }) {
  const [OCRData, setOCRData] = useGlobalState('OCRData');
  const [curNameDrug, setNameDrug] = useState(OCRData[index].drug_name);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [checkedMorning, setCheckedMorning] = useState(false);
  const [checkedAfternoon, setCheckedAfternoon] = useState(false);
  const [checkedNight, setCheckedNight] = useState(false);
  const [openMor, setOpenMor] = useState(false);
  const [openAft, setOpenAft] = useState(false);
  const [openNig, setOpenNig] = useState(false);
  const [dateStart, setDateStart] = useState("Bắt đầu");
  const [dateEnd, setDateEnd] = useState("Kết thúc");
  const [numberPill, setNumberPill] = useState("1");
  const [timeMorText, setTimeMorText] = useState(datetoStringHM(OCRData[index].time_morning));
  const [timeAftText, setTimeAftText] = useState(datetoStringHM(OCRData[index].time_noon));
  const [timeNigText, setTimeNigText] = useState(datetoStringHM(OCRData[index].time_night));
  const [screenState, setScreenState] = useGlobalState('screenState');


  const processOCRData = (scheduleData, OCRData) => {
    for (let i = 0; i < OCRData.length; ++i) {
      let startDate = OCRData[i].date_start
      let endDate = OCRData[i].date_end
      endDate.setHours(23)
      endDate.setMinutes(59)
      endDate.setSeconds(59)
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        let dateString = dateToStringYMD(d)
        if (!scheduleData.hasOwnProperty(dateString)) {
          scheduleData[dateString] = []
        }
        scheduleData[dateString].push({
          drug_name: OCRData[i].drug_name,
          time_morning: OCRData[i].time_morning,
          time_noon: OCRData[i].time_noon,
          time_night: OCRData[i].time_night,
          is_morning: OCRData[i].is_morning,
          is_noon: OCRData[i].is_noon,
          is_night: OCRData[i].is_night,
          number_morning: OCRData[i].number_morning,
          number_noon: OCRData[i].number_noon,
          number_night: OCRData[i].number_night,
          id: OCRData[i].id,
        })
        if (OCRData[i].is_morning) {
          let curDate = new Date(d)
          curDate.setHours(OCRData[i].time_morning.getHours())
          curDate.setMinutes(OCRData[i].time_morning.getMinutes())
          curDate.setSeconds(0)
          if (curDate > Date.now())
            scheduleNotification("VAIPE: Đã đến giờ uống thuốc", "Hãy nhanh chóng uống " + OCRData[i].number_morning + " viên " + OCRData[i].drug_name + " nhé", curDate)
          console.log("curDate", curDate)
        }
        if (OCRData[i].is_noon) {
          let curDate = new Date(d)
          curDate.setHours(OCRData[i].time_noon.getHours())
          curDate.setMinutes(OCRData[i].time_noon.getMinutes())
          curDate.setSeconds(0)
          if (curDate > Date.now())
            scheduleNotification("VAIPE: Đã đến giờ uống thuốc", "Hãy nhanh chóng uống " + OCRData[i].number_noon + " viên " + OCRData[i].drug_name + " nhé", curDate)
          console.log("curDate", curDate)
        }
        if (OCRData[i].is_night) {
          let curDate = new Date(d)
          curDate.setHours(OCRData[i].time_night.getHours())
          curDate.setMinutes(OCRData[i].time_night.getMinutes())
          curDate.setSeconds(0)
          if (curDate > Date.now())
            scheduleNotification("VAIPE: Đã đến giờ uống thuốc", "Hãy nhanh chóng uống " + OCRData[i].number_night + " viên " + OCRData[i].drug_name + " nhé", curDate)
          console.log("curDate", curDate)
        }
      }
    }
    return scheduleData
  }
  const saveOCRdata = async () => {
    if (!checkSave()) {
      Toast.show({
        type: 'error',
        text1: 'Bạn chưa lưu thành công!',
        text2: 'Có viên thuốc chưa có thời gian uống',
      });
      return
    }
    // AsyncStorage.removeItem('@schedule');
    let value = await AsyncStorage.getItem('@schedule');
    if (value !== null)
      value = JSON.parse(value);
    else
      value = {}

    value = processOCRData(value, OCRData)
    console.log(value)
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@schedule', jsonValue)
    setScreenState(SCREEN_STATES.HOMEPAGE)
    Toast.show({
      type: 'success',
      text1: 'Bạn lưu thành công!',
    });
  }

  const dateToStringYMD = (date) => {
    let month = date.getMonth() + 1; //months from 1-12
    let day = date.getDate();
    let year = date.getFullYear();
    newdate = year + "-" + month + "-" + day;
    return newdate
  }
  const checkSave = () => {
    for (let i = 0; i < OCRData.length; ++i) {
      console.log(i, OCRData[i].is_morning, OCRData[i].is_noon, OCRData[i].is_night);
      if (!OCRData[i].is_morning && !OCRData[i].is_noon && !OCRData[i].is_night) {
        console.log(i)
        return false
      }
    }
    return true
  }
  return (
    <ScrollView>
      <View style={styles.bigCard}>
        <View style={styles.card}>
          <Text style={styles.textHeader}>Tên thuốc</Text>
          <View style={styles.textNormalContainer}>
            <Text style={styles.textNormal}>{curNameDrug}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.textHeader}>Số viên trong 1 lần uống</Text>
          <View style={[styles.textNormalContainer, { alignItems: "center" }]}>
            <TextInput
              style={styles.textCenter}
              mode='outlined'
              outlineColor='white'
              keyboardType='numeric'
              value={numberPill}
              onChangeText={(number) => {
                let temp = OCRData
                temp[index].number_morning = number
                temp[index].number_noon = number
                temp[index].number_night = number
                setNumberPill(number)
                setOCRData(temp)
              }}
            />
          </View>
        </View>
        <View style={styles.card}>
          <View style={[styles.headerContainer, styles.twoColumn]}>
            <Text style={styles.textHeader}>Thời gian dùng thuốc:</Text>
          </View>
          <View style={[styles.twoColumn, styles.card, styles.chooseDateContainer]}>
            <View style={[styles.textNormalContainer, {width: "45%", backgroundColor: "#34D7BE", marginRight: "5%"}]}>
              <TouchableOpacity onPress={() => setOpenStartDate(true)}>
                <Text style={[styles.textNormal, {textAlign: "center", color: "white", fontWeight: "bold"}]}>{dateStart}</Text>
              </TouchableOpacity>
              <DatePicker
                title="Chọn ngày bắt đầu"
                confirmText="Lưu"
                cancelText="Hủy"
                mode="date"
                modal
                open={openStartDate}
                date={OCRData[index].date_start}
                onConfirm={date => {
                  setOpenStartDate(false);
                  temp = OCRData
                  temp[index].date_start = date
                  setOCRData(temp)
                  let month = date.getMonth() + 1; //months from 1-12
                  let day = date.getDate();
                  let year = date.getFullYear();
                  let newdate = day + "-" + month + "-" + year;
                  setDateStart(newdate)
                }}
                onCancel={() => {
                  setOpenStartDate(false);
                }}
              />
            </View>
            <View style={[styles.textNormalContainer, {width: "45%", backgroundColor: "#34D7BE", marginLeft: "5%"}]}>
              <TouchableOpacity onPress={() => setOpenEndDate(true)}>
                <Text style={[styles.textNormal, {textAlign: "center", color: "white", fontWeight: "bold"}]}>{dateEnd}</Text>
              </TouchableOpacity>

              <DatePicker
                title="Chọn ngày kết thúc"
                confirmText="Lưu"
                cancelText="Hủy"
                mode="date"
                modal
                open={openEndDate}
                date={OCRData[index].date_end}
                onConfirm={date => {
                  setOpenEndDate(false);
                  temp = OCRData
                  temp[index].date_end = date
                  setOCRData(temp)
                  let month = date.getMonth() + 1; //months from 1-12
                  let day = date.getDate();
                  let year = date.getFullYear();
                  let newdate = day + "-" + month + "-" + year;
                  setDateEnd(newdate)
                }}
                onCancel={() => {
                  setOpenEndDate(false);
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.textHeader}>Đặt giờ uống thuốc</Text>
          <View style={[styles.twoColumn, styles.textNormalContainer, { marginBottom: 20 }]}>

            <TouchableOpacity style={{ width: "50%" }}
              onPress={() => {
                if (checkedMorning === false) setOpenMor(true);
                temp = OCRData
                temp[index].is_morning = !checkedMorning
                setOCRData(temp)
                setCheckedMorning(!checkedMorning);
              }}
            >
              {checkedMorning ? (
                <Text style={[styles.textNormal, styles.leftBookTime, { backgroundColor: "white", color: "black" }]}>Sáng</Text>
              ) : (
                <Text style={[styles.textNormal, styles.leftBookTime, { backgroundColor: "#34D7BE", color: "white" }]}>Sáng</Text>
              )}
            </TouchableOpacity>
            <DatePicker
              title="Chọn thời gian uống thuốc buổi sáng"
              confirmText="Lưu"
              cancelText="Hủy"
              date={OCRData[index].time_morning}
              mode="time"
              modal
              open={openMor}
              onConfirm={date => {
                setOpenMor(false);
                temp = OCRData
                temp[index].time_morning = date
                setOCRData(temp)
                setTimeMorText(datetoStringHM(date))
              }}
              onCancel={() => {
                setOpenMor(false);
                temp = OCRData
                temp[index].is_morning = false
                setOCRData(temp)
                setCheckedMorning(false);
              }}
            />
            {checkedMorning ? (
              <Text style={[styles.textNormal, styles.rightBookTime, { backgroundColor: "#34D7BE", color: "white" }]}>{checkedMorning ? timeMorText : ""}</Text>
            ) : (
              <Text style={[styles.textNormal, styles.rightBookTime, { backgroundColor: "white", color: "black" }]}>{checkedMorning ? timeMorText : ""}</Text>
            )}
          </View>
          <View style={[styles.twoColumn, styles.textNormalContainer, { marginBottom: 20 }]}>
            <TouchableOpacity style={{ width: "50%" }}
              onPress={() => {
                if (checkedAfternoon === false) setOpenAft(true);
                temp = OCRData
                temp[index].is_noon = !checkedAfternoon
                setOCRData(temp)
                setCheckedAfternoon(!checkedAfternoon);
              }}
            >
              {checkedAfternoon ? (
                <Text style={[styles.textNormal, styles.leftBookTime, { backgroundColor: "white", color: "black" }]}>Chiều</Text>
              ) : (
                <Text style={[styles.textNormal, styles.leftBookTime, { backgroundColor: "#34D7BE", color: "white" }]}>Chiều</Text>
              )}
            </TouchableOpacity>
            <DatePicker
              title="Chọn thời gian uống thuốc buổi chiều"
              confirmText="Lưu"
              cancelText="Hủy"
              date={OCRData[index].time_noon}
              mode="time"
              modal
              open={openAft}
              onConfirm={date => {
                setOpenAft(false);
                temp = OCRData
                temp[index].time_noon = date
                setOCRData(temp)
                setTimeAftText(datetoStringHM(date))
              }}
              onCancel={() => {
                setOpenAft(false);
                temp = OCRData
                temp[index].is_noon = false
                setOCRData(temp)
                setCheckedAfternoon(false);
              }}
            />
            {checkedAfternoon ? (
              <Text style={[styles.textNormal, styles.rightBookTime, { backgroundColor: "#34D7BE", color: "white" }]}>{checkedAfternoon ? timeAftText : ""}</Text>
            ) : (
              <Text style={[styles.textNormal, styles.rightBookTime, { backgroundColor: "white", color: "black" }]}>{checkedAfternoon ? timeAftText : ""}</Text>
            )}
          </View>
          <View style={[styles.twoColumn, styles.textNormalContainer, { marginBottom: 20 }]}>
            <TouchableOpacity style={{ width: "50%" }}
              onPress={() => {
                if (checkedNight === false) setOpenNig(true);
                temp[index].is_night = !checkedNight
                setCheckedNight(!checkedNight);
              }}
            >
              {checkedNight ? (
                <Text style={[styles.textNormal, styles.leftBookTime, { backgroundColor: "white", color: "black" }]}>Tối</Text>
              ) : (
                <Text style={[styles.textNormal, styles.leftBookTime, { backgroundColor: "#34D7BE", color: "white" }]}>Tối</Text>
              )}
            </TouchableOpacity>
            <DatePicker
              title="Chọn thời gian uống thuốc buổi tối"
              confirmText="Lưu"
              cancelText="Hủy"
              date={OCRData[index].time_night}
              mode="time"
              modal
              open={openNig}
              onConfirm={date => {
                setOpenNig(false);
                temp = OCRData
                temp[index].time_night = date
                setOCRData(temp)
                setTimeNigText(datetoStringHM(date))
              }}
              onCancel={() => {
                setOpenNig(false);
                temp = OCRData
                temp[index].is_night = false
                setOCRData(temp)
                setCheckedNight(false);
              }}
            />
            {checkedNight ? (
              <Text style={[styles.textNormal, styles.rightBookTime, { backgroundColor: "#34D7BE", color: "white" }]}>{checkedNight ? timeNigText : ""}</Text>
            ) : (
              <Text style={[styles.textNormal, styles.rightBookTime, { backgroundColor: "white", color: "black" }]}>{checkedNight ? timeNigText : ""}</Text>
            )}
          </View>
        </View>
      </View>
      {
        index === OCRData.length - 1 && (
          <TouchableOpacity style={[styles.saveButton]} onPress={saveOCRdata}>
            <FontAwesome5 name="save" size={35} color='white' />
            <Text style={styles.saveTextButton}>Lưu đơn thuốc</Text>
          </TouchableOpacity>)
      }
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  textInput: {
    color: 'black',
    fontSize: 20,
    textAlign: "center",
  },
  container: {
    flex: 1,
  },
  textHeader: {
    fontWeight: "bold",
    fontSize: 20,
    paddingLeft: 40,
    marginBottom: 5,
  },
  header: {
    marginTop: 15,
    marginBottom: 20,
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
  textNormal: {
    fontSize: 22,
    padding: 15,
    paddingLeft: 20,
  },
  textCenter: {
    textAlign: "center",
    fontSize: 22,
    backgroundColor: "white",
    width: "50%",
  },
  headerContainer: {
    // marginLeft: "10%",
  },
  twoColumn: {
    flexDirection: 'row',
  },
  chooseDateContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  timeContainer: {
    alignItems: "center",
    height: 60,
  },
  textTime: {
    fontSize: 20,
  },
  saveButton: {
    flexDirection: 'row',
    marginLeft: "22%",
    marginRight: "22%",
    height: 60,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#339DAD"
  },
  saveTextButton: {
    fontSize: 25,
    marginLeft: 5,
    fontWeight: "bold",
    color: "white"
  },
  card: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  bigCard: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  smallCard: {
    margin: "2%",
    height: 50,
  },
  textNormalContainer: {
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#34D7BE",
  },
  leftBookTime: {
    borderTopLeftRadius: 29,
    borderBottomLeftRadius: 29,
    elevation: 10,
    shadowColor: 'black',
    fontWeight: "bold",
  },
  rightBookTime: {
    width: "50%",
    borderTopRightRadius: 29,
    borderBottomRightRadius: 29,
    fontWeight: "bold",
  }
});

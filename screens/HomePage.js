import * as React from "react";
import { useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import ButtonHomePage from "../src/component/ButtonHomePage";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useGlobalState, SCREEN_STATES } from "../src/component/GlobalHook";
import { dateToStringYMD, dateToStringHM } from "../src/ocr/dateToString";

export default function HomePage() {
  const [screenState, setScreenState] = useGlobalState('screenState');
  const [islandData, setIsLandData] = React.useState([]);

  const changeToCamera = async () => {
    // TODO
    let value = await AsyncStorage.getItem('@schedule');
    if (value == null) {
      Toast.show({
        type: 'error',
        text1: 'Không thể truy cập nhận dạng thuốc',
        text2: 'Bạn chưa có đơn thuốc nào!',
      });
      return
    }
    setScreenState(SCREEN_STATES.PILL_CAMERA)
  }
  const changeToOCR = () => {
    setScreenState(SCREEN_STATES.OCR_START)
  }
  const changeToSchedule = async () => {
    let value = await AsyncStorage.getItem('@schedule');
    if (value == null) {
      Toast.show({
        type: 'error',
        text1: 'Không thể truy cập quản lý uống thuốc',
        text2: 'Bạn chưa có đơn thuốc nào!',
      });
      return
    }
    setScreenState(SCREEN_STATES.SCHEDULE)
  }
  const changeToTip = () => {
    setScreenState(SCREEN_STATES.TIP)
  }
  const takeDrugNeed = async () => {
    let schedules_string = await AsyncStorage.getItem('@schedule');
    let schedules = JSON.parse(schedules_string)

    results = []
    let time_now = new Date()
    is_morning_now = (time_now.getHours() <= 12)
    is_night_now = (time_now.getHours() >= 19)
    is_noon_now = (time_now.getHours() > 12 && time_now.getHours() < 19)

    let schedules_today = schedules[dateToStringYMD(time_now)]
    for (const scheduleDrug of schedules_today) {
      if (scheduleDrug.date_start > time_now || scheduleDrug.date_end < time_now)
        continue
      if (is_morning_now & scheduleDrug.is_morning)
        results.push({ drug_name: scheduleDrug.drug_name, time: scheduleDrug.time_morning })
      if (is_noon_now & scheduleDrug.is_noon)
        results.push({ drug_name: scheduleDrug.drug_name, time: scheduleDrug.time_noon })
      if (is_night_now & scheduleDrug.is_night)
        results.push({ drug_name: scheduleDrug.drug_name, time: scheduleDrug.time_night })
    }
    setIsLandData(results.sort((a, b) => {
      if(a.time > b.time)
        return 1;
      if(a.time < b.time)
        return -1;
    }))
  }

  useEffect(() => {
    takeDrugNeed()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Text style={styles.textHeader1}>Xin Chào</Text>
          <Text style={styles.textHeader2}>Hôm nay, tôi có thể giúp gì cho bạn?</Text>
        </View>
        <View style={styles.headerSearch}>
          <LinearGradient style={styles.buttonSearch} colors={['#339DAD', '#34D7BE']} start={{ x: 1, y: 1 }} end={{ x: 0, y: 0 }}>
            <TouchableOpacity onPress={() => setScreenState(SCREEN_STATES.SEARCH_PILL)}
              style={styles.iconSearch}
            // onPress={navigateFuntion}
            >
              <FontAwesome name='search' size={30} color='#FFFFFF' />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
      <View style={styles.schedule}>
        <View style={styles.island}>
          <View style={styles.headerIsland}>
            <View style={styles.activityContainer}>
              <View style={styles.backgroundBell}>
                <FontAwesome name='bell' size={20} color='#FFFFFF' />
              </View>
              <Text style={styles.textActivity}>Thuốc sắp tới bạn cần uống</Text>
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.textDate}>{dateToStringYMD(new Date())}</Text>
            </View>
          </View>
          <View style={styles.lineIsland} />
          <ScrollView style={styles.contentIsland}>
            {islandData.map((value, index) => {
              let time = new Date(value.time)
              let time_string = dateToStringHM(time)
              return <View style={styles.lineContent} key={index}>
                <Text style={styles.textContent}>{value.drug_name}</Text>
                <Text style={[styles.textDate, {color: "black", marginRight: "10%"}]}>{time_string}</Text>
              </View>
            })
            }
          </ScrollView>
        </View>
      </View>
      <View style={styles.subject}>
        <View style={styles.textSubject1Container}>
          <Text style={styles.textSubject1}>Dịch vụ yêu thích</Text>
        </View>
        <View style={styles.textSubject2Container}>
          <Text style={styles.textSubject2}>Xem tất cả</Text>
        </View>
      </View>
      <View style={styles.buttons}>
        <ButtonHomePage name="Trích xuất đơn thuốc" navigateFuntion={changeToOCR} />
        <ButtonHomePage name="Nhận dạng thuốc" navigateFuntion={changeToCamera} />
        <ButtonHomePage name="Quản lý uống thuốc" navigateFuntion={changeToSchedule} />
        <ButtonHomePage name="Mẹo sức khỏe" navigateFuntion={changeToTip} />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subject: {
    height: "10%",
    width: "100%",
    backgroundColor: "white",
    flexDirection: 'row',
    justifyContent: "space-between",
  },
  textSubject1Container: {
    flexDirection: 'column-reverse',
  },
  textSubject2Container: {
    flexDirection: 'column-reverse',
  },
  textSubject1: {
    marginLeft: "10%",
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
  },
  textSubject2: {
    marginLeft: "10%",
    color: "black",
    fontSize: 16,
  },
  buttons: {
    height: "50%",
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: "white",
    // borderTopLeftRadius: 40,
    // borderTopRightRadius: 40,
  },
  schedule: {
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    height: "25%",
    alignItems: "center",
    backgroundColor: "white",
    // backgroundColor: "#5782EE",
    // borderBottomLeftRadius: 40,
    // borderBottomRightRadius: 40,
    // borderBottomWidth: 5,
    // borderLeftWidth: 10,
    // borderRightWidth: 10,
    // borderColor: "black"
  },
  textHeader1: {
    color: "black",
    // marginTop: "20%",
    fontWeight: '300',
    fontSize: 18,
  },
  textHeader2: {
    width: "90%",
    color: "black",
    fontWeight: "bold",
    fontSize: 22,
  },
  icon: {
    marginTop: "10%",
    marginRight: "5%",
    marginLeft: "5%"
  },
  header: {
    height: "15%",
    backgroundColor: "white",
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  headerSearch: {
    width: "15%",
    height: "90%",
    marginRight: "5%",
    marginTop: "10%",
  },
  headerTitle: {
    width: "65%",
    height: "90%",
    marginLeft: "5%",
    marginRight: "10%",
    marginTop: "10%",
  },
  buttonSearch: {
    marginTop: "20%",
    height: "55%",
    width: "100%",
    borderRadius: 15,
  },
  iconSearch: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  island: {
    marginTop: "5%",
    width: "90%",
    height: "90%",
    borderRadius: 15,
    borderColor: "#34D7BE",
    borderWidth: 1,
  },
  headerIsland: {
    height: "35%",
    flexDirection: 'row',
  },
  contentIsland: {
  },
  textDate: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#34D7BE",
  },
  dateContainer: {
    marginRight: "5%",
    width: "35%",
    flexDirection: 'row-reverse',
    alignItems: "center",
  },
  activityContainer: {
    marginLeft: "5%",
    width: "50%",
    height: "100%",
    flexDirection: 'row',
    alignItems: "center",
  },
  backgroundBell: {
    backgroundColor: "#34D7BE",
    width: "20%",
    height: "60%",
    marginRight: "5%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
  },
  textActivity: {
    width: "70%",
    fontWeight: "bold",
    fontSize: 16,
    color: "#34D7BE",
  },
  textContent: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: "5%",
  },
  lineIsland: {
    width: "90%",
    marginLeft: "5%",
    borderBottomColor: '#34D7BE',
    borderBottomWidth: 1,
  },
  lineContent: {
    flexDirection: "row",
    justifyContent: 'space-between',
    marginBottom: "2%", 
  }
});

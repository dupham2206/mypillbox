import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  LayoutRectangle,
  Dimensions,
} from 'react-native';
import { Canvas, CanvasRenderingContext2D } from 'react-native-pytorch-core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { DataTable } from 'react-native-paper';
import { useGlobalState, SCREEN_STATES } from "../src/component/GlobalHook";
import { dateToStringYMD } from '../src/ocr/dateToString';
import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import TurnBack from '../src/component/TurnBackView';

const drug_name_dict = require('../assets/drug_name_dict.json');

const objectColors = [
  '#FF3B30',
  '#5856D6',
  '#34C759',
  '#007AFF',
  '#FF9500',
  '#AF52DE',
  '#5AC8FA',
  '#FFCC00',
  '#FF2D55',
];

const getCurPartOfDay = (now: Date) => {
  if (now.getHours() <= 11) {
    return "morning"
  }
  if (now.getHours() >= 19) {
    return "night"
  }
  return "noon"
}

const getDrugName = (id: Number) => {
  for (let i = 0; i < drug_name_dict.length; ++i) {
    if (drug_name_dict[i].id == id) {
      return drug_name_dict[i].name
    }
  }
  return null
}

const textBaselineAdjustment = Platform.OS == 'ios' ? 7 : 4;
let end_text = "Bạn đang uống đúng thuốc."
let table_content: Array<any> = []
let countOutDescription = 0
let partOfDay = getCurPartOfDay(new Date())
let mapToVi = (state: any) => {
  if (state == "morning") return "sáng";
  if (state == "noon") return "chiều";
  if (state == "night") return "tối";
}

const topMargin = 100;
const leftMargin = 50;
const bottomMargin = 15;
const boxSize = 75;
const marginIsland = 20;

export default function PillResultsScreen({ onReset }: any) {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);
  const [image, setImage] = useGlobalState<any>('image');
  const [boundingBoxes, setBoundingBoxes] = useGlobalState<any>('boundingBoxes');

  const handleContext2D = useCallback(
    async (ctx: CanvasRenderingContext2D) => {
      setCtx(ctx);
    },
    [setCtx],
  );

  const getBboxResult = async () => {
    let value: any = await AsyncStorage.getItem('@schedule');
    if (value !== null) {
      value = JSON.parse(value);
    }
    let dateString = dateToStringYMD(new Date())
    countOutDescription = 0
    let todaySchedule = value[dateString]

    let partOfDaySchedule: Array<any> = [];
    for (let j = 0; j < todaySchedule.length; ++j) {
      if (partOfDay == "morning" && todaySchedule[j].is_morning) {
        todaySchedule[j]["numberPill"] = todaySchedule[j].number_morning
        partOfDaySchedule.push(todaySchedule[j])
      }
      if (partOfDay == "noon" && todaySchedule[j].is_noon) {
        todaySchedule[j]["numberPill"] = todaySchedule[j].number_noon
        partOfDaySchedule.push(todaySchedule[j])
      }
      if (partOfDay == "night" && todaySchedule[j].is_night) {
        todaySchedule[j]["numberPill"] = todaySchedule[j].number_night
        partOfDaySchedule.push(todaySchedule[j])
      }
    }
    let count = new Array(partOfDaySchedule.length).fill(0);
    for (let i = 0; i < boundingBoxes.length; ++i) {
      let ok = false
      if (boundingBoxes[i].objectClass == 107) {
        boundingBoxes[i].result = false
        boundingBoxes[i].name_drug = null
        countOutDescription += 1
        continue
      }
      for (let j = 0; j < partOfDaySchedule.length; ++j) {
        if ((partOfDaySchedule[j].id).includes((boundingBoxes[i].objectClass).toString())) {
          count[j] += 1
          boundingBoxes[i].result = true
          boundingBoxes[i].name_drug = partOfDaySchedule[j].drug_name
          ok = true
          break
        }
      }
      if (ok == false) {
        boundingBoxes[i].result = false
        boundingBoxes[i].name_drug = getDrugName(boundingBoxes[i].objectClass)
        countOutDescription += 1
      }
    }
    table_content = []
    for (let j = 0; j < partOfDaySchedule.length; ++j) {
      table_content.push({
        drug_name: partOfDaySchedule[j].drug_name,
        need_number: partOfDaySchedule[j]["numberPill"],
        use_number: count[j],
        ok: partOfDaySchedule[j]["numberPill"] == count[j]
      })
      if (partOfDaySchedule[j]["numberPill"] != count[j]) {
        end_text = "Bạn đang uống sai thuốc."
      }
    }
    if (countOutDescription != 0) {
      end_text += " Chú ý " + countOutDescription + " viên thuốc sai, không cần uống trong " + mapToVi(partOfDay) + " nay."
    }
    if (table_content.length == 0) {
      end_text = mapToVi(partOfDay) + " nay bạn không cần uống thuốc."
    }
  }

  useEffect(() => {
    end_text = "Bạn đang uống đúng thuốc."
    countOutDescription = 0
    partOfDay = getCurPartOfDay(new Date())
    getBboxResult();
    if (ctx != null) {
      const imageWidth = image.getWidth();
      const imageHeight = image.getHeight();
      const size = [0, 0];
      size[0] = Dimensions.get('screen').width;
      size[1] = Dimensions.get('screen').height;
      const scale = Math.max(size[0] / imageWidth, size[1] / imageHeight);
      const displayWidth = imageWidth * scale;
      const displayHeight = imageHeight * scale;

      if (boundingBoxes) {
        boundingBoxes.forEach((boundingBox: any, index: number) => {
          const { objectClass, bounds } = boundingBox;

          // const boxColor = objectColors[index % objectColors.length];
          const boxColor = "#000000";
          ctx.strokeStyle = boxColor;
          ctx.lineWidth = 3;
          ctx.beginPath();

          const w = bounds[2];
          const h = bounds[3];
          let max_size = Math.max(bounds[2], bounds[3]);
          let new_w = (boxSize * w) / max_size;
          let new_h = (boxSize * h) / max_size;
          ctx.rect(leftMargin, topMargin + index * (boxSize + bottomMargin) + marginIsland, boxSize, boxSize);
          ctx.drawImage(
            image,
            bounds[0],
            bounds[1],
            bounds[2],
            bounds[3],
            leftMargin,
            topMargin + index * (boxSize + bottomMargin) + marginIsland,
            new_w,
            new_h,
          );
          ctx.stroke();
        });
      }
      ctx.invalidate();
    }
  }, [ctx, layout]);

  return (
    <View style={styles.container}>
      <TurnBack backgroundColorText={null} colorText={"white"} text="Kết quả nhận dạng thuốc" handleReset={onReset} backState={undefined}/>
      <ScrollView style={styles.container}>
        <View style={styles.allResultContainer}>
          <View style={styles.marginIsland}></View>
          {boundingBoxes.map((value: any, index: any) => {
            // default 
            let resTitle = "Loại thuốc cần uống";
            let resDescription = "Không thể phát hiện được tên thuốc"
            let colorTitle = "#1DD824"
            let icon = <FontAwesome name="check" size={30} color={colorTitle} />
            if (value.result == false) {
              resTitle = 'Sai thuốc!!!';
              colorTitle = "#E54343";
              icon = <FontAwesome name="exclamation" size={30} color={colorTitle} />
            }
            if (value.name_drug != null) resDescription = value.name_drug
            return (
              <View style={styles.resultContainer} key={index}>
                {icon}
                <View style={styles.resultTitleContainer}>
                  <Text style={[styles.textStyleResult, { color: colorTitle }]}>{resTitle}</Text>
                  <Text style={styles.textStyleNameDrug}>{resDescription}</Text>
                </View>
              </View>
            )
          })}
          <View style={styles.marginIsland}></View>
        </View>
        <Canvas
          style={[StyleSheet.absoluteFill, {top: -topMargin}]}
          // style={StyleSheet.absoluteFillObject}
          // style={{flex: 1}}
          onContext2D={setCtx}
          onLayout={event => {
            setLayout(event.nativeEvent.layout);
          }}
        />
        <View style={styles.truePillContainer}>
          <Text style={[styles.title, { color: "black", fontSize: 22, marginTop: 15 }]}>Đối chiếu với đơn thuốc</Text>
          {table_content.map((value, index) => {
            let colorTitle = "#1DD824"
            if (value.need_number != value.use_number) {
              colorTitle = "#E54343"
            }
            return (
              <View style={styles.pillCard} key={index}>
                <Text style={[styles.pillNameText, { color: colorTitle, borderLeftColor: colorTitle }]}>   {value.drug_name}</Text>
                <Text style={styles.numberOfPillText}>   Số viên thuốc cần uống: {value.need_number}</Text>
                <Text style={[styles.numberOfPillText, { marginBottom: 10 }]}>   Số viên thuốc chẩn đoán: {value.use_number}</Text>
              </View>
            )
          })}
          <Card style={styles.card}>
            <Card.Content>
              <View>
                <Text style={styles.end_text}>{end_text}</Text>
              </View>
            </Card.Content>
          </Card>
          <View style={styles.bottomContainer}>
            <TouchableOpacity onPress={onReset} style={styles.resetButton}>
              <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>Trở về trang chủ</Text>
            </TouchableOpacity>
          </View>
        </View>


      </ScrollView >
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  allResultContainer: {
    backgroundColor: "white",
    width: "85%",
    marginLeft: "7.5%",
    marginRight: "7.5%",
    borderRadius: 20,
  },
  bottomContainer: {
    width: '100%',
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#34D7BE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  textStyleResult: {
    fontSize: 20,
    fontWeight: "bold"
  },
  textStyleNameDrug: {
    fontSize: 18,
  },
  resultTitleContainer: {
  },
  resultContainer: {
    height: boxSize,
    marginLeft: leftMargin + boxSize - 5,
    marginBottom: bottomMargin,
    width: "55%",
    flexDirection: 'row',
  },
  title: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    color: "white"
  },
  gradient: {
    height: topMargin - 20,
    alignItems: "center",
    marginTop: 20,
  },
  card: {
    margin: 20,
    alignItems: "center",
  },
  end_text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerTableText: {
    fontWeight: "bold",
    color: "black",
  },
  marginIsland: {
    height: marginIsland,
  },
  numberOfPillText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  pillNameText: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "bold",
    borderLeftWidth: 2,
  },
  pillCard: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 10,
    shadowColor: 'black',
  },
  truePillContainer: {
    marginTop: 60,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

  }
});

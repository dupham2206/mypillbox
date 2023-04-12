import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import * as React from 'react';
import Fontisto from 'react-native-vector-icons/Fontisto';
import LinearGradient from 'react-native-linear-gradient';
const nameIcon = {
  "Trích xuất đơn thuốc": "prescription",
  "Nhận dạng thuốc": "pills",
  "Quản lý uống thuốc": "person",
  "Mẹo sức khỏe": "heart",
  "Máy ảnh": "camera",
  "Thư viện ảnh": "picture",
}

export default function ButtonHomePage({ name, img, navigateFuntion }) {
  return (
    <LinearGradient style={styles.gradient} colors={['#339DAD', '#34D7BE']} start={{ x: 1, y: 1 }} end={{ x: 0, y: 0 }}>
      <TouchableOpacity
        style={styles.button}
        onPress={navigateFuntion}
      >
        <Fontisto name={nameIcon[name]} size={65} style={styles.icon} color={styles.text.color} />
        <Text style={styles.text}>{name}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: 25,
    marginRight: 25,
  },
  gradient: {
    borderRadius: 20,
    width: "42.5%",
    height: "42.5%",
    marginTop: "5%",
    marginLeft: "5%",
    // marginRight: "5%",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: '100%',
  },
  icon: {
    marginTop: 25,
    marginBottom: 10,
  },
});

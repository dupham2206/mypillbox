import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ScrollView } from "react-native";
import ButtonHomePage from "../src/component/ButtonHomePage";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useGlobalState, SCREEN_STATES } from "../src/component/GlobalHook";
import TurnBack from "../src/component/TurnBackView";
import PillSearch from "../src/pill_search/pillSearch";

export default function SearchPillDetailScreen() {
        const [pillChoose, setPillChoose] = useGlobalState('pillChoose');

	return (
	    <View style={styles.container}>
            <TurnBack backgroundColorText={null} colorText="white" text="Thông tin thuốc" backState={SCREEN_STATES.SEARCH_PILL}/>
	    <View style={[styles.elementResult, {borderTopLeftRadius: 20, borderTopRightRadius: 20}]}>
                            <View style={styles.imageContainer}>
                                <Image source={pillChoose["link_image"]} resizeMode="cover" style={styles.image} />
                            </View>
                            <View style={styles.textElementResultContainer}>
                                <Text style={styles.textElementResult}>{pillChoose["name"]}</Text>
                            </View>
	    </View>
            <View style={styles.line} />
	    <View style={[styles.elementResult, {borderBottomLeftRadius: 20, borderBottomRightRadius: 20, height: "70%", borderColor: '#34D7BE', borderWidth: 1}]}>
	    	<Text style={styles.textDescription}>{pillChoose["description"]}</Text>
	    </View>
            </View>
	)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    icon: {
        width: "18%",
        alignItems: "center",
        justifyContent: "center",
        borderRightWidth: 1,
        borderColor: "#808080",
    },
    input: {
        width: "82%",
        color: "black",
        fontSize: 18,
        fontWeight: "bold",
    },
    elementResult: {
        width: "80%",
        height: 100,
        backgroundColor: "white",
        marginLeft: "10%",
        marginRight: "10%",
        // marginTop: "10%",
        elevation: 10,
        shadowColor: 'black',
        flexDirection: "row",
    },
    textElementResult: {
        fontSize: 18,
        fontWeight: "bold",
    },
    textDescription: {
	fontSize: 18,
        margin: "5%"
    },
    textElementResultContainer: {
        width: "60%",
        height: "100%",
        justifyContent: "center",
        marginRight: "5%",
        marginLeft: "5%",

    },
    imageContainer: {
        width: "25%",
        height: "100%",
        marginLeft: "5%",
    },
    image: {
        marginTop: "20%",
        marginBottom: "20%",
        flex: 1,
        height: null,
        width: null,
        height: "75%",
        resizeMode: 'contain'
    },
    line: {
    	borderBottomColor: '#34D7BE',
    	borderBottomWidth: 5,
	marginLeft: "10%",
        marginRight: "10%",
        
    }
});
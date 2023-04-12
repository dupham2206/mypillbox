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

export default function SearchPillScreen() {
    const [textSearch, setTextSearch] = React.useState('');
    const [listPill, setListPill] = React.useState([]);
    const [screenState, setScreenState] = useGlobalState('screenState');
    const [pillChoose, setPillChoose] = useGlobalState('pillChoose');
    
    const handlePress = () => {
	
    	setScreenState(SCREEN_STATES.SEARCH_PILL_DETAIL);
    }
    return (
        <View style={styles.container}>
            <TurnBack backgroundColorText={null} colorText="white" text="Tìm kiếm thuốc" />
            <View style={styles.searchPillContainer}>
                <LinearGradient style={styles.searchContainer} colors={['#339DAD', '#34D7BE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <View style={styles.searchLand}>
                        <View style={styles.icon}>
                            <FontAwesome name="search" size={30} color="#808080" />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập thuốc bạn muốn tìm"
                            placeholderTextColor="#808080"
                            onChangeText={(text) => {
                                setTextSearch(text)
                                setListPill(PillSearch(text))
                            }}
                            value={textSearch}
                        />
                    </View>
                </LinearGradient>
                <ScrollView>
                    {listPill.map((element, index) => {
                        return <TouchableOpacity style={styles.elementResult} key={index} onPress={() => {
                                setPillChoose(element);
				setScreenState(SCREEN_STATES.SEARCH_PILL_DETAIL);
    			    }}>
                            <View style={styles.imageContainer}>
                                <Image source={element["link_image"]} resizeMode="cover" style={styles.image} />
                            </View>
                            <View style={styles.textElementResultContainer}>
                                <Text style={styles.textElementResult}>{element["name"]}</Text>
                            </View>
                        </TouchableOpacity>
                    })}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchPillContainer: {
        backgroundColor: "white",
        flex: 1,
    },
    searchContainer: {
        height: "15%",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    searchLand: {
        height: 55,
        marginLeft: "10%",
        marginRight: "10%",
        backgroundColor: "white",
        borderRadius: 10,
        flexDirection: "row",
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
        marginTop: "10%",
        elevation: 10,
        borderRadius: 20,
        shadowColor: 'black',
        flexDirection: "row",
    },
    textElementResult: {
        fontSize: 18,
        fontWeight: "bold",
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
    }
});
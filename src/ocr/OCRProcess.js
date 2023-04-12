import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import ProgressCircle from 'react-native-progress/Circle';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
import TesseractOcr, {
    LANG_ENGLISH,
    LANG_VIETNAMESE,
    useEventListener,
} from 'react-native-tesseract-ocr';
import TurnBack from '../component/TurnBackView';
import ButtonHomePage from '../component/ButtonHomePage';
import OCRInformation from '../component/OCRInformation';
import { Image } from 'react-native-svg';
import { useGlobalState, SCREEN_STATES } from '../component/GlobalHook';

const drug_name_dict = require('../../assets/drug_name_dict.json');
const tip = require('../../assets/tip.json')

export function removeAccents(str) {
    var AccentsMap = [
        'aàảãáạăằẳẵắặâầẩẫấậ',
        'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
        'dđ',
        'DĐ',
        'eèẻẽéẹêềểễếệ',
        'EÈẺẼÉẸÊỀỂỄẾỆ',
        'iìỉĩíị',
        'IÌỈĨÍỊ',
        'oòỏõóọôồổỗốộơờởỡớợ',
        'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
        'uùủũúụưừửữứự',
        'UÙỦŨÚỤƯỪỬỮỨỰ',
        'yỳỷỹýỵ',
        'YỲỶỸÝỴ',
    ];
    for (var i = 0; i < AccentsMap.length; i++) {
        var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
        var char = AccentsMap[i][0];
        str = str.replace(re, char);
    }
    return str;
}

export function longestCommonSubsequence(a, b) {
    const matrix = Array(a.length + 1).fill().map(() => Array(b.length + 1).fill(0));
    for (let i = 1; i < a.length + 1; i++) {
        for (let j = 1; j < b.length + 1; j++) {
            if (a[i - 1] === b[j - 1]) {
                matrix[i][j] = 1 + matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
            }
        }
    }
    return matrix[a.length][b.length];
}

export const levenshteinDistance = (str1 = '', str2 = '') => {
    const track = Array(str2.length + 1)
        .fill(null)
        .map(() => Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) {
        track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
        track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
        for (let i = 1; i <= str1.length; i += 1) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(
                track[j][i - 1] + 1, // deletion
                track[j - 1][i] + 1, // insertion
                track[j - 1][i - 1] + indicator, // substitution
            );
        }
    }
    return track[str2.length][str1.length];
};

export const processOCR = (recognizedText, OCRData, setOCRData) => {
    let DrugScheduleInfo = [];
    let lines = recognizedText.split('\n');
    for (let i = 0; i < lines.length; ++i) {
        if (lines[i][1] == ')' || lines[i][2] == ')') {
            lines[i] = lines[i].split(')')[1];
            lines[i] = lines[i].split('SL:');
            let Drug = correctOCR(lines[i][0]);
            let nameDrug = Drug['name'];
            let idDrug = Drug['id'];
            temp = OCRData;
            let time_morning = new Date()
            time_morning.setHours(8)
            time_morning.setMinutes(0)
            let time_noon = new Date()
            time_noon.setHours(13)
            time_noon.setMinutes(0)
            let time_night = new Date()
            time_night.setHours(20)
            time_night.setMinutes(0)
            temp.push({
                drug_name: nameDrug,
                date_start: new Date(),
                date_end: new Date(),
                time_morning: time_morning,
                time_noon: time_noon,
                time_night: time_night,
                is_morning: false,
                is_noon: false,
                is_night: false,
                number_morning: 1,
                number_noon: 1,
                number_night: 1,
                id: idDrug,
            });
            setOCRData(temp);
        }
    }
    temp = OCRData;
    setOCRData(temp);
};

const correctOCR = name => {
    let bestDistance = 1000;
    let bestIndex = 0;
    let name_process = removeAccents(name.toLowerCase().replace(/\s/g, ''))
    for (let i = 0; i < drug_name_dict.length; ++i) {
        let cur_string_process = removeAccents(drug_name_dict[i]['name'].toLowerCase().replace(/\s/g, ''))
        let distance = levenshteinDistance(name_process, cur_string_process) - longestCommonSubsequence(name_process, cur_string_process)
        if (distance < bestDistance) {
            bestDistance = distance;
            bestIndex = i;
        }
    }
    ids = [];
    for (let i = 0; i < drug_name_dict.length; ++i) {
        if (drug_name_dict[i]['name'] === drug_name_dict[bestIndex]['name']) {
            ids.push(drug_name_dict[i]['id']);
        }
    }
    return { name: drug_name_dict[bestIndex]['name'], id: ids };
};

export const takeTip = (setTipUse) => {
    let randTip = Math.floor(Math.random() * tip.length);
    setTipUse(tip[randTip])
}
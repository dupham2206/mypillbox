import { pillInfo } from '../../assets/pill_info';
import { removeAccents, levenshteinDistance, longestCommonSubsequence } from '../ocr/OCRProcess';

export default function PillSearch(key) {
    key_process = removeAccents(key.toLowerCase().replace(/\s/g, ''))
    const results = [];

    pillInfo.forEach((element) => {
        name_process =  removeAccents(element["name"].toLowerCase().replace(/\s/g, ''))
        element["score"] = - longestCommonSubsequence(name_process, key_process)
    });

    pillInfo.sort((a, b) => {
        if(a["score"] > b["score"]){
            return 1;
        }
        else {
            return -1;
        }
    })

    for (let i = 0; i < 7; i++) {
        results.push(pillInfo[i])
        
    }

    return results;

}
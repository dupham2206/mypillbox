import { pillInfo } from '../../assets/pill_info';
import { removeAccents, levenshteinDistance, longestCommonSubsequence, longestPrefixSame } from '../ocr/OCRProcess';

export default function PillSearch(key) {
    key_process = removeAccents(key.toLowerCase().replace(/\s/g, ''))
    const results = [];

    pillInfo.forEach((element) => {
        name_process =  removeAccents(element["name"].toLowerCase().replace(/\s/g, ''))
        element["score"] = longestPrefixSame(name_process, key_process) + longestCommonSubsequence(name_process, key_process)
    });
    pillInfo_clone = pillInfo.slice()
    pillInfo_clone.sort((a, b) => {
        if(a["score"] < b["score"]){
            return 1;
        }
        else {
            return -1;
        }
    })
    for (let i = 0; i < 7 ; i++) {
        results.push(pillInfo_clone[i])
    }
    return results;

}
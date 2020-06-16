import {csvParse} from 'd3-dsv';
import * as CONST from './consts.js';

export default class Utils {
  // Find differences of column names: find extra colnames
  static diffCols(colnames){
    let cols = new Set(colnames);
    let hdrs = new Set(CONST.EXPECT_HEADER);

    let leftDiff = [...cols].filter(x => !hdrs.has(x));
    return(leftDiff);
  }

  // Find differences of expected header: find missing colnames
  static diffHeader(colnames){
    let cols = new Set(colnames);
    let hdrs = new Set(CONST.EXPECT_HEADER);

    let rightDiff = [...hdrs].filter(x => !cols.has(x));
    return(rightDiff);
  }

  //Parse file data to data frame (array of rows)
  static parseToDf(fileData){ 
    if(fileData.charCodeAt(0) === 0x50 && fileData.charCodeAt(1) === 0x4B){
      throw CONST.XLSX_ERROR;
    }
    return(csvParse(fileData.toLowerCase())); 
  }

  static isEmpty(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

}


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
}


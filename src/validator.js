import Marple from './marple.js';
import Utils from './utils.js';

// Validate file data
export default class Validator {
  static validateFile(fileData) { 
    let problems = Marple.reportProblems(fileData);
    return(Utils.isEmpty(problems));
  }

  static verifyHeader(colnames){
    let oord = Marple.outOfLocHeaders(colnames),
        miss = Marple.missingHeaders(colnames),
        extr = Marple.extraHeaders(colnames);

    return(oord.length < 1 && 
           miss.length < 1 && 
           extr.length < 1); 
  }

  //Check given value against good values
  static validateValue(input, expected){ 
    return(expected.includes(input));
  }

  static validateRow(row){
    let problems = Marple.sleuthRow(row);
    if(problems.length === 0){return(true);}
    else{return(false);}
  }

  static validateDataFrame(df){
    return(df.every(Validator.validateRow));
  }
}

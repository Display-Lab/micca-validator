import Utils from './utils.js';
import * as CONST from './consts.js';

// Detective class for sleuthing out problems with input
export default class Marple {
  static missingHeaders(colnames){
    let missingHdrs = Utils.diffHeader(colnames);
    return(missingHdrs);
  }

  static extraHeaders(colnames){
    let extraHdrs = Utils.diffCols(colnames);
    return(extraHdrs);
  }

  static checkValue(input, expected){ 
    return(expected.includes(input));
  }

  static checkDateOrUnknown(input){ 
    if(input === "unknown"){ 
      return(true);
    }else{
      return(Marple.checkDate(input));
    }
  }

  static checkDate(input){ 
    if(CONST.DATE_REGEX.test(input) && Date.parse(input)){
      return(true);
    }else{
      return(false);
    }
  }

  static sleuthRow(row){
    let passes = [
      row.patient_mrn !== "",
      Marple.checkDate(row.delivery_date),
      Marple.checkValue(row.counseling, CONST.COUNSELING),
      Marple.checkValue(row.contra_choice, CONST.CONTRACEPTION_CHOICE),
      Marple.checkValue(row.imm_method, CONST.IMMEDIATE_METHOD),
      Marple.checkValue(row.contra_prov, CONST.CONTRACEPTION_PROVISION),
      Marple.checkValue(row.larc_prov, CONST.LARC_PROVISION),
      Marple.checkValue(row.payer, CONST.PAYER),
      Marple.checkDateOrUnknown(row.choice_date),
      Marple.checkValue(row.peripartum_care, CONST.PERIPARTUM_CARE)];

    let colsInError = [];
    for(let i=0;i<passes.length;i++){
      if(passes[i] === false){ colsInError.push(Object.keys(row)[i]); }
    }
    
    return(colsInError);
  }

  static allRowProblems(df){
    let rowProblems = [];
    let report = {};
    for(let i=0; i<df.length; i++){
      rowProblems = Marple.sleuthRow(df[i]);
      if(rowProblems.length > 0){ report[i+1] = rowProblems; }
    }
    return(report);
  }
}

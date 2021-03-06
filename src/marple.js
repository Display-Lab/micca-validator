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

  static outOfLocHeaders(colnames){
    let oOLCols = colnames.filter( (ele, i) => {
      if(CONST.EXPECT_HEADER.indexOf(ele) > -1 &&
         CONST.EXPECT_HEADER.indexOf(ele) !== i){
        return(true);
      }
    });
    return(oOLCols);
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
      Marple.checkValue(row.contraception_choice, CONST.CONTRACEPTION_CHOICE),
      Marple.checkValue(row.immediate_method, CONST.IMMEDIATE_METHOD),
      Marple.checkValue(row.contraception_provision, CONST.CONTRACEPTION_PROVISION),
      Marple.checkValue(row.larc_provision, CONST.LARC_PROVISION),
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
      if(rowProblems.length > 0){ report[i+2] = rowProblems; }
    }
    return(report);
  }

  static reportProblems(rawData){
    let df, report = {};
    try{ 
      df = Utils.parseToDf(rawData); 
    } catch(e) { 
      report["parsing"] = e; 
      return(report);
    }

    let extrHdr = Marple.extraHeaders(df.columns);
    let missHdr = Marple.missingHeaders(df.columns);
    let oordHdr = Marple.outOfLocHeaders(df.columns);

    //initialize headerProblems
    if(extrHdr.length + missHdr.length + missHdr.length > 0){ report["headerProblems"]={}; }

    if(extrHdr.length > 0){ report["headerProblems"]["Extra Headers"] = extrHdr;}
    if(missHdr.length > 0){ report["headerProblems"]["Missing Headers"] = missHdr;}
    if(missHdr.length > 0){ report["headerProblems"]["Misplaced Headers"] = oordHdr;}

    let rowPblms = Marple.allRowProblems(df);
    if(!Utils.isEmpty(rowPblms)){ report["rowProblems"] = rowPblms; }

    return(report);
  }
}

import {csvParse} from 'd3-dsv';
import Marple from './marple.js';
import * as CONST from './consts.js';

// convenience method to compare array members.
const compareArrays = (a, b) => a.map(JSON.stringify).join() === b.map(JSON.stringify).join();

// Validate file data
export function validateFile(fileData) { 
  let df;
  try{
    df = parseToDf(fileData); 
  }catch(e){
    return(false);
  }
  return(validateDataFrame(df));
}

// Compare colnames to expected columns
export function verifyHeader(colnames){
  return( compareArrays(colnames, CONST.EXPECT_HEADER) );
}

//Check given value against good values
export function validateValue(input, expected){ 
  return(expected.includes(input));
}

export function validateDateOrUnknown(input){ 
  if(input === "unknown"){ 
    return(true);
  }else{
    return(validateDate(input));
  }
}

export function validateDate(input){ 
  if(CONST.DATE_REGEX.test(input) && Date.parse(input)){
    return(true);
  }else{
    return(false);
  }
}

export function validateRow(row){
  let passing = [
    row.patient_mrn !== "",
    validateDate(row.delivery_date),
    validateValue(row.counseling, CONST.COUNSELING),
    validateValue(row.contra_choice, CONST.CONTRACEPTION_CHOICE),
    validateValue(row.imm_method, CONST.IMMEDIATE_METHOD),
    validateValue(row.contra_prov, CONST.CONTRACEPTION_PROVISION),
    validateValue(row.larc_prov, CONST.LARC_PROVISION),
    validateValue(row.payer, CONST.PAYER),
    validateDateOrUnknown(row.choice_date),
    validateValue(row.peripartum_care, CONST.PERIPARTUM_CARE)
  ];
  return(passing.every((x)=> x===true));
}

export function validateDataFrame(df){
  return(df.every(validateRow));
}

//Parse file data to data frame (array of rows)
export function parseToDf(fileData){ 
  if(fileData.charCodeAt(0) === 0x50 && fileData.charCodeAt(1) === 0x4B){
    throw CONST.XLSX_ERROR;
  }
  return(csvParse(fileData.toLowerCase())); 
}


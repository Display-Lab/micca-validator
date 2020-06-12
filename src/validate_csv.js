import {csvParse} from 'd3-dsv';

// Allowed column names in order
export const EXPECT_HEADER=["patient_mrn","delivery_date","counseling","contra_choice","imm_method",
                             "contra_prov","larc_prov","payer","choice_date","peripartum_care"]

// Allowed values for columns
const COUNSELING = ["yes","no","unknown"];
const CONTRACEPTION_CHOICE = ["immediate pp iud", "immediate pp nexplanon", "pptl", "other", "none", "unknown"];
const IMMEDIATE_METHOD = ["immediate pp iud", "immediate pp nexplanon", "pptl", "other", "none", "unknown"];
const CONTRACEPTION_PROVISION = ["0-3 days", "4-60 days", "not provisioned", "unknown"];
const LARC_PROVISION = ["0-3 days", "4-60 days pp visit","4-60 days not pp visit", "not provisioned", "unknown"];
const PAYER = ["medicaid", "molina", "private", "other", "unknown"];
const PERIPARTUM_CARE = ["yes","no","unknown"];

// Allowed date format
const DATE_REGEX = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;

const XLSX_ERROR = {
  name: "Excel Input Error",
  message: "Input file is an Excel xlsx or xlsb.  This tool can only handle csv files."};

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
  return( compareArrays(colnames, EXPECT_HEADER) );
}

// Find differences of column names: find extra colnames
export function diffCols(colnames){
  let cols = new Set(colnames);
  let hdrs = new Set(EXPECT_HEADER);

  let leftDiff = [...cols].filter(x => !hdrs.has(x));
  return(leftDiff);
}

// Find differences of expected header: find missing colnames
export function diffHeader(colnames){
  let cols = new Set(colnames);
  let hdrs = new Set(EXPECT_HEADER);

  let rightDiff = [...hdrs].filter(x => !cols.has(x));
  return(rightDiff);
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
  if(DATE_REGEX.test(input) && Date.parse(input)){
    return(true);
  }else{
    return(false);
  }
}

export function validateRow(row){
  let passing = [
    row.patient_mrn !== "",
    validateDate(row.delivery_date),
    validateValue(row.counseling,COUNSELING),
    validateValue(row.contra_choice,CONTRACEPTION_CHOICE),
    validateValue(row.imm_method,IMMEDIATE_METHOD),
    validateValue(row.contra_prov,CONTRACEPTION_PROVISION),
    validateValue(row.larc_prov,LARC_PROVISION),
    validateValue(row.payer,PAYER),
    validateDateOrUnknown(row.choice_date),
    validateValue(row.peripartum_care,PERIPARTUM_CARE)
  ];
  return(passing.every((x)=> x===true));
}

export function validateDataFrame(df){
  return(df.every(validateRow));
}

//Parse file data to data frame (array of rows)
export function parseToDf(fileData){ 
  if(fileData.charCodeAt(0) === 0x50 && fileData.charCodeAt(1) === 0x4B){
    throw XLSX_ERROR;
  }
  return(csvParse(fileData.toLowerCase())); 
}

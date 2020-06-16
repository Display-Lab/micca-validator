import Marple from './marple.js';
import Utils from './utils.js';
import * as CONST from './consts.js';

// convenience method to compare array members.
const compareArrays = (a, b) => a.map(JSON.stringify).join() === b.map(JSON.stringify).join();

// Validate file data
export function validateFile(fileData) { 
  let df;
  try{
    df = Utils.parseToDf(fileData); 
  }catch(e){
    return(false);
  }

  console.log(df);
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

export function validateRow(row){
  let problems = Marple.sleuthRow(row);
  if(problems.length === 0){return(true);}
  else{return(false);}
}

export function validateDataFrame(df){
  return(df.every(validateRow));
}


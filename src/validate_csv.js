import Marple from './marple.js';
import Utils from './utils.js';

// Validate file data
export function validateFile(fileData) { 
  let problems = Marple.reportProblems(fileData);
  return(Utils.isEmpty(problems));
}

export function verifyHeader(colnames){
  let oord = Marple.outOfLocHeaders(colnames),
      miss = Marple.missingHeaders(colnames),
      extr = Marple.extraHeaders(colnames);

  return(oord.length < 1 && 
         miss.length < 1 && 
         extr.length < 1); 
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


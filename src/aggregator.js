import {csvParse} from 'd3-dsv';
import * as d3c from 'd3-collection'
import * as d3a from 'd3-array'
import * as CONST from './consts.js';
import clone from 'lodash';
import Utils from './utils.js';

// Aeta: eater.  Eater of data
export default class Aeta {

  static digestFile(fileData) { 
    let df = Utils.parseToDf(fileData.toLowerCase()); 
    return({});
  }

  // convert yes/no to true/false
  // classify payer as medicaid or non_medicaid
  static mutateValues(df){
    let mdf = df.map((d,i)=>{
      d.counseling      = d.counseling === 'yes' ? true : false;
      d.payer           = d.payer === 'medicaid' ? d.payer : 'non_medicaid';
      d.peripartum_care = d.peripartum_care === 'yes' ? true : false;
      return(d)
    });

    //preserve columns
    mdf.columns = df.columns;
    return(mdf);
  }

  static calcComponents(df){

  }

}

//calculate_components <- function(proc_data){
//  proc_data %>%
//    mutate(report_month = floor_date(delivery_date, unit="month"),
//           quarter = as.yearqtr(delivery_date)) %>%
//    group_by(report_month, payer) %>%
//    summarize(
//      C1 = n(),
//      C2 = sum(contra_prov == "0-3 days"),
//      C3 = sum(contra_prov == "4-60 days"),
//      C4 = sum(larc_prov == "0-3 days"),
//      C5 = sum(larc_prov == "4-60 days pp visit" | larc_prov == "4-60 days not pp visit" ),
//      #C6 = NA, # deprecated
//      C7 = sum(counseling),
//      C8 = sum(contra_choice != "unknown"),
//      C9 = sum(contra_choice == "immediate pp iud" | contra_choice == "immediate pp nexplanon"),
//      #C10 = sum(contra_choice != "none"), # deprecated
//      C11 = sum(contra_choice != "unknown" & contra_choice == imm_method & contra_prov == "0-3 days"),
//      C12 = sum(larc_prov == "4-60 days pp visit" | larc_prov == "4-60 days not pp visit"),
//      C13 = sum(contra_choice == "immediate pp iud"),
//      C14 = sum(contra_choice == "immediate pp nexplanon"),
//      C15 = sum(contra_choice == "pptl"),
//      C16 = sum(contra_choice == "other"),
//      C17 = sum(contra_choice == "immediate pp iud" & imm_method == "immediate pp iud"),
//      C18 = sum(contra_choice == "immediate pp nexplanon" & imm_method == "immediate pp nexplanon"),
//      C19 = sum(contra_choice == "pptl" & imm_method == "pptl"),
//      C20 = sum(contra_choice == "other" & imm_method == "other"),
//      C21 = sum(imm_method == "immediate pp iud"),
//      C22 = sum(imm_method == "immediate pp nexplanon")
//    )
//}

import {csvParse} from 'd3-dsv';
import * as d3c from 'd3-collection';
import * as d3a from 'd3-array';
import moment from 'moment';
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
      d.report_month = moment.utc(d.delivery_date)
                             .startOf('month')
                             .format('YYYY-MM-DD');
      return(d)
    });

    //preserve columns
    mdf.columns = df.columns;
    return(mdf);
  }

  static calcComponents(df){
    let groupFuns = [d => d.report_month, d => d.payer];

    return(new Array());
  }

  static calcGroupComponents(df){
    let groupFuns = [d => d.report_month, d => d.payer];

    let components = [
      d3a.rollup(df, v => {return new Map().set("C1", v.length)}, ...groupFuns),
      d3a.rollup(df.filter(d => d.contra_prov === '0-3 days'), 
                 v => {return new Map().set("C2", v.length)}, ...groupFuns),
      d3a.rollup(df.filter(d => d.contra_prov === '4-60 days'), 
                 v => {return new Map().set("C3", v.length)}, ...groupFuns),
      d3a.rollup(df.filter(d => d.larc_prov === '0-3 days'), 
                 v => {return new Map().set("C4", v.length)}, ...groupFuns),
      d3a.rollup(df.filter(d => {return(d.larc_prov === '4-60 days pp visit' || d.larc_prov === '4-60 days not pp visit')}),
                 v => {return new Map().set("C5", v.length)}, ...groupFuns),
      //component 6 deprecated
      d3a.rollup(df.filter(d => d.counseling), 
                 v => {return new Map().set("C7", v.length)}, ...groupFuns),
      d3a.rollup(df.filter(d => d.contra_choice !== 'unknown'), 
                 v => {return new Map().set("C8", v.length)}, ...groupFuns),
      d3a.rollup(df.filter(d => d.contra_choice === "immediate pp iud" || d.contra_choice === "immediate pp nexplanon"),
                 v => {return new Map().set("C9", v.length)}, ...groupFuns),
      //component 10 deprecated
      d3a.rollup(df.filter(d => d.contra_choice !== "unknown" && d.contra_choice === d.imm_method && d.contra_prov === "0-3 days"),
                 v => {return new Map().set("C11", v.length)}, ...groupFuns),
      d3a.rollup(df.filter(d => d.larc_prov === "4-60 days pp visit" || d.larc_prov === "4-60 days not pp visit"),
                 v => {return new Map().set("C12", v.length)}, ...groupFuns),
      d3a.rollup(df.filter(d => d.contra_choice === "immediate pp iud"), 
                 v => {return new Map().set("C13", v.length)}, ...groupFuns),
      d3a.rollup(df.filter(d => d.contra_choice === "immediate pp nexplanon"), 
                 v => {return new Map().set("C14", v.length)}, ...groupFuns),
      d3a.rollup(df.filter(d => d.contra_choice === "pptl"), 
                 v => {return new Map().set("C15", v.length)}, ...groupFuns),
      d3a.rollup(df.filter(d => d.contra_choice === "other"), 
                 v => {return new Map().set("C16", v.length)}, ...groupFuns),
      d3a.rollup(df.filter(d => d.contra_choice === "immediate pp iud" && d.imm_method === "immediate pp iud"),
                 v => {return new Map().set("C17", v.length)}, ...groupFuns),
      d3a.rollup(df.filter(d => d.contra_choice === "immediate pp nexplanon" && d.imm_method === "immediate pp nexplanon"),
                 v => {return new Map().set("C18", v.length)}, ...groupFuns),
      d3a.rollup(df.filter(d => d.contra_choice === "pptl" && d.imm_method === "pptl"),
                 v => {return new Map().set("C19", v.length)}, ...groupFuns),
      d3a.rollup(df.filter(d => d.contra_choice === "other" && d.imm_method === "other"),
                 v => {return new Map().set("C20", v.length)}, ...groupFuns),
      d3a.rollup(df.filter(d => d.imm_method === "immediate pp iud"), 
                 v => {return new Map().set("C21", v.length)}, ...groupFuns),
      d3a.rollup(df.filter(d => d.imm_method === "immediate pp nexplanon"), 
                 v => {return new Map().set("C22", v.length)}, ...groupFuns)
    ];
    
    return(components);
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

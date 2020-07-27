import {csvParse, csvFormat} from 'd3-dsv';
import * as d3c from 'd3-collection';
import * as d3a from 'd3-array';
import moment from 'moment';
import {clone} from 'lodash';

// Aeta: eater.  Eater of data
export default class Aeta {

  static digestFile(fileData) { 
    let df = csvParse(fileData.toLowerCase()); 
    let munged    = Aeta.mutateValues(df);
    let grouped   = Aeta.calcComponents(munged);
    let ungrouped = Aeta.ungroupComponents(grouped);
    let wideComps = Aeta.widenComponents(ungrouped);
    let measures  = Aeta.calcMeasures(wideComps);

    // Tack on newline to match R output
    return(csvFormat(measures)+'\n');
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

    return(mdf);
  }

  static filtC2(d){return(d.contraception_provision === '0-3 days')}
  static filtC3(d){return(d.contraception_provision === '4-60 days')}
  static filtC4(d){return(d.larc_provision === '0-3 days')}
  static filtC5(d){return(d.larc_provision === '4-60 days pp visit' || d.larc_provision === '4-60 days not pp visit')}
  static filtC7(d){return(d.counseling)}
  static filtC8(d){return(d.contraception_choice !== 'unknown')}
  static filtC9(d){return(d.contraception_choice === "immediate pp iud" || d.contraception_choice === "immediate pp nexplanon")}
  static filtC11(d){return(d.contraception_choice !== "unknown" && d.contraception_choice === d.immediate_method && d.contraception_provision === "0-3 days")}
  static filtC12(d){return(d.larc_provision === "4-60 days pp visit" || d.larc_provision === "4-60 days not pp visit")}
  static filtC13(d){return(d.contraception_choice === "immediate pp iud")}
  static filtC14(d){return(d.contraception_choice === "immediate pp nexplanon")}
  static filtC15(d){return(d.contraception_choice === "pptl")}
  static filtC16(d){return(d.contraception_choice === "other")}
  static filtC17(d){return(d.contraception_choice === "immediate pp iud" && d.immediate_method === "immediate pp iud")}
  static filtC18(d){return(d.contraception_choice === "immediate pp nexplanon" && d.immediate_method === "immediate pp nexplanon")}
  static filtC19(d){return(d.contraception_choice === "pptl" && d.immediate_method === "pptl")}
  static filtC20(d){return(d.contraception_choice === "other" && d.immediate_method === "other")}
  static filtC21(d){return(d.immediate_method === "immediate pp iud")}
  static filtC22(d){return(d.immediate_method === "immediate pp nexplanon")}


  static calcComponents(df){
    let groupFuns = [d => d.report_month, d => d.payer];

    let components = [
      ["C1", d3a.rollups(df, v => v.length, ...groupFuns)],
      ["C2", d3a.rollups(df, v => v.filter(Aeta.filtC2).length, ...groupFuns)],
      ["C3", d3a.rollups(df, v => v.filter(Aeta.filtC3).length, ...groupFuns)],
      ["C4", d3a.rollups(df, v => v.filter(Aeta.filtC4).length, ...groupFuns)],
      ["C5", d3a.rollups(df, v => v.filter(Aeta.filtC5).length, ...groupFuns)],
      //component 6 depsrec
      ["C7", d3a.rollups(df, v => v.filter(Aeta.filtC7).length, ...groupFuns)],
      ["C8", d3a.rollups(df, v => v.filter(Aeta.filtC8).length, ...groupFuns)],
      ["C9", d3a.rollups(df, v => v.filter(Aeta.filtC9).length, ...groupFuns)],
      //component 10 despre
      ["C11",d3a.rollups(df, v =>  v.filter(Aeta.filtC11).length, ...groupFuns)],
      ["C12",d3a.rollups(df, v =>  v.filter(Aeta.filtC12).length, ...groupFuns)],
      ["C13",d3a.rollups(df, v =>  v.filter(Aeta.filtC13).length, ...groupFuns)],
      ["C14",d3a.rollups(df, v =>  v.filter(Aeta.filtC14).length, ...groupFuns)],
      ["C15",d3a.rollups(df, v =>  v.filter(Aeta.filtC15).length, ...groupFuns)],
      ["C16",d3a.rollups(df, v =>  v.filter(Aeta.filtC16).length, ...groupFuns)],
      ["C17",d3a.rollups(df, v =>  v.filter(Aeta.filtC17).length, ...groupFuns)],
      ["C18",d3a.rollups(df, v =>  v.filter(Aeta.filtC18).length, ...groupFuns)],
      ["C19",d3a.rollups(df, v =>  v.filter(Aeta.filtC19).length, ...groupFuns)],
      ["C20",d3a.rollups(df, v =>  v.filter(Aeta.filtC20).length, ...groupFuns)],
      ["C21",d3a.rollups(df, v =>  v.filter(Aeta.filtC21).length, ...groupFuns)],
      ["C22",d3a.rollups(df, v =>  v.filter(Aeta.filtC22).length, ...groupFuns)]
    ];
    return(components);
  }

  // Innermost reducer. Starts the row object.
  static payerReducer(acc, cur, idx, src){ 
    acc.push({'payer': cur[0], 'value': cur[1]});
    return(acc); 
  }

  // Add report_month to row objects
  static dateReducer(acc, curr, idx, src){
    let payers = curr[1].reduce(Aeta.payerReducer, []);
    let date_added = payers.map(e => {e.report_month = curr[0]; return e});

    acc.push(date_added);
    return acc;
  }

  // Add component id to row objects
  static compReducer(acc, curr, idx, src){
    let dates = curr[1].reduce(Aeta.dateReducer, []).flat();
    let comp_added = dates.map(e => {e.comp = curr[0]; return e});

    acc.push(comp_added);
    return acc;
  }

  // Ungroup components array to make long component data
  static ungroupComponents(comps){
    return(comps.reduce(Aeta.compReducer, []).flat());
  }

  // Convert long component data to wide component datat
  static widenComponents(longComps){
    // reducer function to convert component name into column
    let compWidener = function(acc, curr, idx, src){
      acc[curr['comp']] = curr['value'];
      return acc;
    }
    // grouping functions
    let groupFuns = [d => d.report_month, d => d.payer];

    let grouped = d3a.groups(longComps, ...groupFuns);
    let rows = [];
    let month, payer, newRow;
    grouped.forEach( month_row => {
      month = month_row[0];
      month_row[1].forEach( payer_row =>{
        payer = payer_row[0];
        newRow = {};
        newRow['report_month'] = month;
        newRow['payer'] = payer;
        //Assign component properties to 
        Object.assign(newRow, payer_row[1].reduce(compWidener, {}));
        rows.push(newRow);
      });
    });
    return(rows);
  }

  // reducer for taking wide component data and creating long measure rows
  static measureReducer(acc, curr){
    let rowBase = {time: curr.report_month, group: curr.payer}
    // push measures onto the accumulator
    let measures = [
      {measure: 'M1',  numerator: curr['C2'],  denominator: curr['C1']},
      {measure: 'M2',  numerator: curr['C3'],  denominator: curr['C1']},
      {measure: 'M3',  numerator: curr['C4'],  denominator: curr['C1']},
      {measure: 'M4',  numerator: curr['C5'],  denominator: curr['C1']},
      {measure: 'M5',  numerator: curr['C7'],  denominator: curr['C1']},
      {measure: 'M6',  numerator: curr['C8'],  denominator: curr['C1']},
      {measure: 'M7',  numerator: curr['C9'],  denominator: curr['C8']},
      {measure: 'M8',  numerator: curr['C11'], denominator: curr['C8']},
      {measure: 'M9',  numerator: curr['C12'], denominator: curr['C1']},
      {measure: 'M10', numerator: curr['C13'], denominator: curr['C8']},
      {measure: 'M11', numerator: curr['C14'], denominator: curr['C8']},
      {measure: 'M12', numerator: curr['C15'], denominator: curr['C8']},
      {measure: 'M13', numerator: curr['C16'], denominator: curr['C8']},
      {measure: 'M14', numerator: curr['C1'],  denominator: 'NA'},
      {measure: 'M16', numerator: curr['C17'], denominator: curr['C13']},
      {measure: 'M17', numerator: curr['C18'], denominator: curr['C14']},
      {measure: 'M18', numerator: curr['C19'], denominator: curr['C15']},
      {measure: 'M19', numerator: curr['C20'], denominator: curr['C16']},
      {measure: 'M20', numerator: curr['C21'], denominator: curr['C3']},
      {measure: 'M21', numerator: curr['C22'], denominator: curr['C3']}
    ];

    measures.forEach( m => {
      acc.push(Object.assign(clone(rowBase),m));
    });
    return(acc);
  }

  static calcMeasures(wideComps){
    return( wideComps.reduce( Aeta.measureReducer, []) ); 
  }
}

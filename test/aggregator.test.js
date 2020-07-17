import {expect} from 'chai';
import {csvParse} from 'd3-dsv';
import moment from 'moment';
import Aeta from '../src/aggregator.js'
import * as fs from 'fs';
import goodCsvRaw from './fixtures/good_data.csv'
import goodDfRaw from './fixtures/good_df.csv'
import goodMaptgRaw from './fixtures/good_maptg.csv'

// Helper function to read a file from disk
function readFile(path){
  try{
    let reader = new FileReader();
    reader.readAsText(file);	
  }
  catch(err){
    console.log(err);
  }
}

var goodParsed, goodDf;
before("Setup data frames.", function(){
  goodParsed = csvParse(goodCsvRaw.toLowerCase()); 
  goodDf = csvParse(goodDfRaw); 
})

//helper function to apply to each row during testing
function checkReportMonth(report_month){
  //Regex to check that month ends in "-01"
  const REPORT_MONTH_REGEX = /[0-9]{4}-[0-9]{2}-01/;
  if(REPORT_MONTH_REGEX.test(report_month) && Date.parse(report_month)){ 
    return(true)
  }else{
    return(false)
  }
}

describe('Aggregator', function(){
  // Testing the data aggregator.
  describe('digestFile()', function(){
    it('accepts raw good data', function(){
      let result = Aeta.digestFile(goodCsvRaw);
      expect(result).to.be.an('object');
    });

    it.skip('emits maptg data', function(){
      let result = Aeta.digestFile(goodCsvRaw);
      expect(result).to.be.an('object');
    });
  });

  describe('mutateValues()', function(){
    let result;
    before(function(){
      result = Aeta.mutateValues(goodParsed);
    });

    it('Converts counseling to true|false', function(){
      expect(result.every(
        (val,i,arr) => {return(val.counseling === true || val.counseling === false)})
      ).to.be.true;
    });

    it('Converts peripartum_care to true|false', function(){
      expect(result.every(
        (val,i,arr) => {return(val.peripartum_care === true || val.peripartum_care === false)})
      ).to.be.true;
    });

    it('Converts payer to medicaid|non_medicaid', function(){
      expect(result.every(
        (val,i,arr) => {return(val.payer === 'medicaid' || val.payer === 'non_medicaid')})
      ).to.be.true;
    });

    it('Preserves columns', function(){
      expect(result.columns).to.eql(goodParsed.columns);
    });

    describe('Calculated report_month', function(){
      it('Represented as string', function(){
        expect(result.every( (val,i,arr) => {return(typeof(val.report_month) === "string") })
        ).to.be.true;
      });

      it('All are first of a month', function(){
        expect(result.every( (val,i,arr) => { return checkReportMonth(val.report_month) })
        ).to.be.true;
      });
    });
  });

  describe('calcComponents()', function(){
    let result;
    // Depends on mutate values: fix this at some point.
    before(function(){
      let mungedDf = Aeta.mutateValues(goodDf)
      result = Aeta.calcComponents(mungedDf);
    });

    it('Returns an array', function(){
      expect(result).to.be.an('array');
    });
  });


});

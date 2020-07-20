import {expect} from 'chai';
import {csvParse} from 'd3-dsv';
import moment from 'moment';
import md5 from 'js-md5'
import * as fs from 'fs';
import refInputRaw from './fixtures/good_data.csv';
import refMeasuresRaw from './fixtures/good_measures.csv';
import {groupedComponents, wideComponents, longComponents} from './fixtures/good_components.js';
import {mungedDf} from './fixtures/good_df.js';
import Aeta from '../src/aggregator.js'


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

var goodParsed, refMeasures;
before("Setup data frames.", function(){
  goodParsed = csvParse(refInputRaw.toLowerCase()); 
  refMeasures = csvParse(refMeasuresRaw);
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
  let result;
  before(function(){
    result = Aeta.digestFile(refInputRaw);
  });

  describe('digestFile()', function(){
    it('accepts raw good data', function(){
      expect(result).to.be.a('string');
    });

    it('emits measure data corresponding to R output', function(){
      let md5result = md5(result);
      let md5ref = md5(refMeasuresRaw);

      expect(md5result).to.equal(md5ref);
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
    before(function(){
      result = Aeta.calcComponents(mungedDf);
    });

    it('emits array element per compoent', function(){
      expect(result).to.be.an('array');
      expect(result.length).to.equal(20);
    });
  });

  describe('ungroupComonents()', function(){
    it('emits row per component, report_month, and payer', function(){
      let result = Aeta.ungroupComponents(groupedComponents);
      expect(result).to.be.an('array');
      expect(result.length).to.equal(120);
    });
  });

  describe('widenComponents()', function(){
    let result;
    before(function(){
      result = Aeta.widenComponents(longComponents);
    });

    it('emit row report_month, payer', function(){
      expect(result).to.be.an('array');
      expect(result.length).to.equal(6);
    });

    it('emits same data as R script', function(){
      expect(result).to.eql(wideComponents);
    });
  });
});

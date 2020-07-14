import {expect} from 'chai';
import {csvParse} from 'd3-dsv';
import Aeta from '../src/aggregator.js'
import * as fs from 'fs';
import goodCsvRaw from './fixtures/good_data.csv'

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

var goodDf;
before("Setup data frames.", function(){
  goodDf = csvParse(goodCsvRaw.toLowerCase()); 
})

// Testing the data aggregator.
describe('digestFile()', function(){
  it('accepts raw good data', function(){
    let result = Aeta.digestFile(goodCsvRaw);
    expect(result).to.be.an('object');
  });
});

describe('mutateValues()', function(){
  let result;
  before(function(){
    result = Aeta.mutateValues(goodDf);
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
    expect(result.columns).to.eql(goodDf.columns);
  });
});




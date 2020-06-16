//var assert = require('assert');
import {expect} from 'chai';
import {csvParse} from 'd3-dsv';
import * as CONST from '../src/consts.js';
import Validate from '../src/validate.js'
import * as fs from 'fs';
import goodCsvRaw from './fixtures/good_data.csv'
import badCsvRaw from './fixtures/bad_data.csv'
import xlsxRaw from './fixtures/good_data.xlsx'

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

var goodDf, badDf;
before("Setup data frames.", function(){
  goodDf = csvParse(goodCsvRaw.toLowerCase()); 
  badDf = csvParse(badCsvRaw.toLowerCase()); 
})

// Helper function to remove a value from an array.
function removeFromArray(arr,val){
  let idx = arr.indexOf(val);
  if (idx > -1) { arr.splice(idx, 1); }
  return(arr);
}


// Checking the testing framework behaves as expected.
describe('testing framework', function(){
  it('makes packed data is available', function(){
    expect(goodCsvRaw.length).to.equal(1067);
  });
});

// Testing the validator.
describe('validateFile()', function(){
  it('accepts raw good data', function(){
    let result = Validate.validateFile(goodCsvRaw);
    expect(result).to.equal(true);
  });

  it('rejects raw bad data', function(){
    let result = Validate.validateFile(badCsvRaw);
    expect(result).to.equal(false);
  });

  it.skip('rejects Excel format data', function(){
    let result = Validate.validateFile(xlsxRaw);
    expect(result).to.equal(false);
  });

});

describe('verifyHeader', function(){
  it('indicates true when all headers are present in expected order', function(){
    expect(Validate.verifyHeader(CONST.EXPECT_HEADER,CONST.EXPECT_HEADER)).to.equal(true);
  });

  it('indicates false when colnames are out of order.', function(){
    let misordered = [...CONST.EXPECT_HEADER.slice(6), ...CONST.EXPECT_HEADER.slice(0,6)];
    expect(misordered.length).to.equal(CONST.EXPECT_HEADER.length);
    expect(Validate.verifyHeader(misordered,CONST.EXPECT_HEADER)).to.equal(false);
  });

  it('indicates false when colnames are missing.', function(){
    let missingLast = CONST.EXPECT_HEADER.slice(1,5);
    expect(Validate.verifyHeader(missingLast,CONST.EXPECT_HEADER)).to.equal(false);
  });

  it('indicates false when colnames are wrong.', function(){
    let wrongName = [...CONST.EXPECT_HEADER];
    wrongName[1] = "badname";
    expect(Validate.verifyHeader(wrongName,CONST.EXPECT_HEADER)).to.equal(false);
  });

  it('indicates false when extra colnames.', function(){
    let hasExtra = [...CONST.EXPECT_HEADER];
    hasExtra.push("extra");
    expect(Validate.verifyHeader(hasExtra,CONST.EXPECT_HEADER)).to.equal(false);
  });

  it('indicates false when extra blank columns.', function(){
    let extraBlankCols = [...CONST.EXPECT_HEADER];
    extraBlankCols.push("");

    let result = Validate.verifyHeader(extraBlankCols,CONST.EXPECT_HEADER);
    expect(result).to.equal(false);
  });
});


describe('validateValue', function(){
  it('accepts when input is in array', function(){
    let result = Validate.validateValue("foo", ["foo", "bar", "baz"]);
    expect(result).to.be.true;
  });

  it('rejects when input is not in array', function(){
    let result = Validate.validateValue("bad", ["foo", "bar", "baz"]);
    expect(result).to.be.false;
  });
});

describe('validateRow', function(){
  it('accepts all rows from good data', function(){
    let result = goodDf.every(Validate.validateRow);
    expect(result).to.be.true;
  });

  it('accepts first row from good data', function(){
    let goodRow = goodDf[0];
    let result = Validate.validateRow(goodRow);
    expect(result).to.be.true;
  });

  it('rejects row with value not in enumeration', function(){
    let badRow = {...goodDf[0]};
    badRow.counseling = "badVal";
    
    let result = Validate.validateRow(badRow);
    expect(result).to.be.false;
  });
});

describe('validateDataFrame', function(){
  it('accepts good data', function(){
    let result = Validate.validateDataFrame(goodDf);
    expect(result).to.be.true;
  });
});


import {expect} from 'chai';
import {csvParse} from 'd3-dsv';
import * as CONST from '../src/consts.js';
import Validator from '../src/validator.js'
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


describe('Validator', function(){
  // Checking the testing framework behaves as expected.
  describe('testing framework', function(){
    it('makes packed data is available', function(){
      expect(goodCsvRaw.length).to.equal(2965);
    });
  });

  // Testing the validator.
  describe('validateFile()', function(){
    it('accepts raw good data', function(){
      let result = Validator.validateFile(goodCsvRaw);
      expect(result).to.equal(true);
    });

    it('rejects raw bad data', function(){
      let result = Validator.validateFile(badCsvRaw);
      expect(result).to.equal(false);
    });

    it('rejects Excel format data', function(){
      let result = Validator.validateFile(xlsxRaw);
      expect(result).to.equal(false);
    });

  });

  describe('verifyHeader', function(){
    it('indicates true when all headers are present in expected order', function(){
      expect(Validator.verifyHeader(CONST.EXPECT_HEADER,CONST.EXPECT_HEADER)).to.equal(true);
    });

    it('indicates false when colnames are out of order.', function(){
      let misordered = [...CONST.EXPECT_HEADER.slice(6), ...CONST.EXPECT_HEADER.slice(0,6)];
      expect(misordered.length).to.equal(CONST.EXPECT_HEADER.length);
      expect(Validator.verifyHeader(misordered,CONST.EXPECT_HEADER)).to.equal(false);
    });

    it('indicates false when colnames are missing.', function(){
      let missingLast = CONST.EXPECT_HEADER.slice(1,5);
      expect(Validator.verifyHeader(missingLast,CONST.EXPECT_HEADER)).to.equal(false);
    });

    it('indicates false when colnames are wrong.', function(){
      let wrongName = [...CONST.EXPECT_HEADER];
      wrongName[1] = "badname";
      expect(Validator.verifyHeader(wrongName,CONST.EXPECT_HEADER)).to.equal(false);
    });

    it('indicates false when extra colnames.', function(){
      let hasExtra = [...CONST.EXPECT_HEADER];
      hasExtra.push("extra");
      expect(Validator.verifyHeader(hasExtra,CONST.EXPECT_HEADER)).to.equal(false);
    });

    it('indicates false when extra blank columns.', function(){
      let extraBlankCols = [...CONST.EXPECT_HEADER];
      extraBlankCols.push("");

      let result = Validator.verifyHeader(extraBlankCols,CONST.EXPECT_HEADER);
      expect(result).to.equal(false);
    });
  });


  describe('validateValue', function(){
    it('accepts when input is in array', function(){
      let result = Validator.validateValue("foo", ["foo", "bar", "baz"]);
      expect(result).to.be.true;
    });

    it('rejects when input is not in array', function(){
      let result = Validator.validateValue("bad", ["foo", "bar", "baz"]);
      expect(result).to.be.false;
    });
  });

  describe('validateRow', function(){
    it('accepts all rows from good data', function(){
      let result = goodDf.every(Validator.validateRow);
      expect(result).to.be.true;
    });

    it('accepts first row from good data', function(){
      let goodRow = goodDf[0];
      let result = Validator.validateRow(goodRow);
      expect(result).to.be.true;
    });

    it('rejects row with value not in enumeration', function(){
      let badRow = {...goodDf[0]};
      badRow.counseling = "badVal";
      
      let result = Validator.validateRow(badRow);
      expect(result).to.be.false;
    });
  });

  describe('validateDataFrame', function(){
    it('accepts good data', function(){
      let result = Validator.validateDataFrame(goodDf);
      expect(result).to.be.true;
    });
  });
});


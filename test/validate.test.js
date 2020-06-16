//var assert = require('assert');
import {expect} from 'chai';
import {csvParse} from 'd3-dsv';
import * as CONST from '../src/consts.js';
import * as bdl from '../src/validate_csv.js'
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

describe('parseToDf', function(){
  //TODO Figure out how to test if all keys and values are lowercase
  it.skip('converts entire contents to lower case', function(){
    let csvData="Foo,Bar,Baz\n10,Yes,Unknown\n12,No,PPTL\n";
    let result = bdl.parseToDf(csvData);
  });

  it('throws error on xlsx data', function(){
    let binding = bdl.parseToDf.bind(this, xlsxRaw);
    expect(binding).to.throw("Excel");
  });
});

// Testing the validator.
describe('validateFile()', function(){
  it('accepts raw good data', function(){
    let result = bdl.validateFile(goodCsvRaw);
    expect(result).to.equal(true);
  });

  it('rejects raw bad data', function(){
    let result = bdl.validateFile(badCsvRaw);
    expect(result).to.equal(false);
  });

  it.skip('rejects Excel format data', function(){
    let result = bdl.validateFile(xlsxRaw);
    expect(result).to.equal(false);
  });

});

describe('verifyHeader', function(){
  it('indicates true when all headers are present in expected order', function(){
    expect(bdl.verifyHeader(CONST.EXPECT_HEADER,CONST.EXPECT_HEADER)).to.equal(true);
  });

  it('indicates false when colnames are out of order.', function(){
    let misordered = [...CONST.EXPECT_HEADER.slice(6), ...CONST.EXPECT_HEADER.slice(0,6)];
    expect(misordered.length).to.equal(CONST.EXPECT_HEADER.length);
    expect(bdl.verifyHeader(misordered,CONST.EXPECT_HEADER)).to.equal(false);
  });

  it('indicates false when colnames are missing.', function(){
    let missingLast = CONST.EXPECT_HEADER.slice(1,5);
    expect(bdl.verifyHeader(missingLast,CONST.EXPECT_HEADER)).to.equal(false);
  });

  it('indicates false when colnames are wrong.', function(){
    let wrongName = [...CONST.EXPECT_HEADER];
    wrongName[1] = "badname";
    expect(bdl.verifyHeader(wrongName,CONST.EXPECT_HEADER)).to.equal(false);
  });

  it('indicates false when extra colnames.', function(){
    let hasExtra = [...CONST.EXPECT_HEADER];
    hasExtra.push("extra");
    expect(bdl.verifyHeader(hasExtra,CONST.EXPECT_HEADER)).to.equal(false);
  });

  it('indicates false when extra blank columns.', function(){
    let extraBlankCols = [...CONST.EXPECT_HEADER];
    extraBlankCols.push("");

    let result = bdl.verifyHeader(extraBlankCols,CONST.EXPECT_HEADER);
    expect(result).to.equal(false);
  });
});

describe('diffCols', function(){
  it('returns empty when no differnces.', function(){
    let result = bdl.diffCols(CONST.EXPECT_HEADER,CONST.EXPECT_HEADER);
    expect(result).to.be.empty;
  });

  it('points out bad name of column.', function(){
    let wrongName = [...CONST.EXPECT_HEADER];
    wrongName[1] = "badname";

    let result = bdl.diffCols(wrongName,CONST.EXPECT_HEADER);
    expect(result).to.have.lengthOf(1);
    expect(result).to.include("badname");
  });

  it('points out name of extra column.', function(){
    let hasExtra = [...CONST.EXPECT_HEADER];
    hasExtra.push("extra");

    let result = bdl.diffCols(hasExtra,CONST.EXPECT_HEADER);
    expect(result).to.have.lengthOf(1);
    expect(result).to.include("extra");
  });

  it('points out name of extra blank columns.', function(){
    let extraBlankCols = [...CONST.EXPECT_HEADER];
    extraBlankCols.push("");
    extraBlankCols.push("");

    let result = bdl.diffCols(extraBlankCols,CONST.EXPECT_HEADER);
    expect(result).to.have.lengthOf(1);
    expect(result).to.include("");
  });
});

describe('diffCols', function(){
  it('points out name of missing column.', function(){
    let missingColName = [...CONST.EXPECT_HEADER];
    removeFromArray(missingColName, CONST.EXPECT_HEADER[2]);

    let result = bdl.diffHeader(missingColName,CONST.EXPECT_HEADER);
    expect(result).to.have.lengthOf(1);
    expect(result).to.include(CONST.EXPECT_HEADER[2]);
  });

  it('does not report extra column.', function(){
    let hasExtra = [...CONST.EXPECT_HEADER];
    hasExtra.push("extra");

    let result = bdl.diffHeader(hasExtra,CONST.EXPECT_HEADER);
    expect(result).to.be.empty;
  });
});


describe('validateDate', function(){
  it('accepts yyyy-MM-dd dates', function(){
    let result = bdl.validateDate("2020-11-22");
    expect(result).to.be.true;
  });

  it('rejects MM/dd/yyyy dates', function(){
    let result = bdl.validateDate("11/22/2020");
    expect(result).to.be.false;
  });

  it('rejects out of bounds dates', function(){
    let result = bdl.validateDate("2020-22-22");
    expect(result).to.be.false;
  });
});

describe('validateDateOrUnknown', function(){
  it('accepts unknown', function(){
    let result = bdl.validateDateOrUnknown("unknown");
    expect(result).to.be.true;
  });

  it('accepts yyyy-MM-dd dates', function(){
    let result = bdl.validateDateOrUnknown("2020-11-22");
    expect(result).to.be.true;
  });

  it('rejects MM/dd/yyyy dates', function(){
    let result = bdl.validateDateOrUnknown("11/22/2020");
    expect(result).to.be.false;
  });

  it('rejects out of bounds dates', function(){
    let result = bdl.validateDateOrUnknown("2020-22-22");
    expect(result).to.be.false;
  });
});

describe('validateValue', function(){
  it('accepts when input is in array', function(){
    let result = bdl.validateValue("foo", ["foo", "bar", "baz"]);
    expect(result).to.be.true;
  });

  it('rejects when input is not in array', function(){
    let result = bdl.validateValue("bad", ["foo", "bar", "baz"]);
    expect(result).to.be.false;
  });
});

describe('validateRow', function(){
  it('accepts all rows from good data', function(){
    let result = goodDf.every(bdl.validateRow);
    expect(result).to.be.true;
  });

  it('accepts first row from good data', function(){
    let goodRow = goodDf[0];
    let result = bdl.validateRow(goodRow);
    expect(result).to.be.true;
  });

  it('rejects row with value not in enumeration', function(){
    let badRow = {...goodDf[0]};
    badRow.counseling = "badVal";
    
    let result = bdl.validateRow(badRow);
    expect(result).to.be.false;
  });
});

describe('validateDataFrame', function(){
  it('accepts good data', function(){
    let result = bdl.validateDataFrame(goodDf);
    expect(result).to.be.true;
  });
});


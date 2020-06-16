import {csvParse} from 'd3-dsv';
import {expect} from 'chai';
import * as CONST from '../src/consts.js';
import Marple from '../src/marple.js'
import goodCsvRaw from './fixtures/good_data.csv'
import badCsvRaw from './fixtures/bad_data.csv'

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

describe('Marple static methods', function(){
  describe('missingHeaders', function(){
    it('returns empty array when all headers are present', function(){
      let result = Marple.missingHeaders(CONST.EXPECT_HEADER);
      expect(result).to.eql([]);
    });

    it('returns list of missing headers', function(){
      let missingLast = CONST.EXPECT_HEADER.slice(0,6);

      let result = Marple.missingHeaders(missingLast);
      expect(result).to.eql(CONST.EXPECT_HEADER.slice(6));
    });
  });

  describe('extraHeaders', function(){
    it('returns empty array when all headers are present', function(){
      let result = Marple.extraHeaders(CONST.EXPECT_HEADER);
      expect(result).to.eql([]);
    });

    it('returns list of extra headers', function(){
      let hasExtra = [...CONST.EXPECT_HEADER];
      hasExtra.push("extra");

      let result = Marple.extraHeaders(hasExtra);
      expect(result).to.eql(["extra"]);
    });
  });

  describe('sleuthRow', function(){
    it('returns empty array when data is good', function(){
      let result = Marple.sleuthRow(goodDf[1]);
      expect(result).to.eql([]);
    });

    it('returns name of column if column is empty.', function(){
      let row, result;
      goodDf.columns.forEach( (col) => {
        row = {...goodDf[1]};
        row[col] = "";
        result = Marple.sleuthRow(row);
        expect(result).to.eql([col]);
      });
    });

    it('identifies date columns with bad dates.', function(){
      let badDatesRow = {...goodDf[1]};
      badDatesRow['delivery_date'] = "2/10/2020";
      badDatesRow['choice_date'] = "2020-13-01";

      let result = Marple.sleuthRow(badDatesRow);

      expect(result).to.eql(['delivery_date', 'choice_date']);
    });

    it('identifies columns with garbage data.', function(){
      let garbageRow = {...goodDf[1]};
      let garbageCols = [];

      goodDf.columns.slice(1).forEach( (col) => {
        if(Math.random() >= 0.7){
          garbageRow[col] = "garbage";
          garbageCols.push(col);
        }
      });

      let result = Marple.sleuthRow(garbageRow);
      expect(result).to.eql(garbageCols);
    });
  });

  describe('allRowProblems', function(){
    it('is empty for good data.', function(){
      let result = Marple.allRowProblems(goodDf);
      expect(result).to.eql({});
    });

    it('has one key for each row of bad data', function(){
      let result = Marple.allRowProblems(badDf);
      let nkeys = Object.keys(result).length;
      expect(nkeys).to.eql(badDf.length);
    });
  });

  describe('checkDate', function(){
    it('accepts yyyy-MM-dd dates', function(){
      let result = Marple.checkDate("2020-11-22");
      expect(result).to.be.true;
    });

    it('rejects MM/dd/yyyy dates', function(){
      let result = Marple.checkDate("11/22/2020");
      expect(result).to.be.false;
    });

    it('rejects out of bounds dates', function(){
      let result = Marple.checkDate("2020-22-22");
      expect(result).to.be.false;
    });
  });

  describe('checkDateOrUnknown', function(){
    it('accepts unknown', function(){
      let result = Marple.checkDateOrUnknown("unknown");
      expect(result).to.be.true;
    });

    it('accepts yyyy-MM-dd dates', function(){
      let result = Marple.checkDateOrUnknown("2020-11-22");
      expect(result).to.be.true;
    });

    it('rejects MM/dd/yyyy dates', function(){
      let result = Marple.checkDateOrUnknown("11/22/2020");
      expect(result).to.be.false;
    });

    it('rejects out of bounds dates', function(){
      let result = Marple.checkDateOrUnknown("2020-22-22");
      expect(result).to.be.false;
    });
  });

});

